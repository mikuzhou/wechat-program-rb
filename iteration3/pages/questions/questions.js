// 文件名称：question.js
// 开发者：马子智
// 开发时间：2022.6.5
// 文件功能：question页面的主要展示内容，事件响应
const app = getApp()
let titles = [] //题库
let errorOptions = []

Page({
  data: {
    percent: 0,
    total: 0,
    isSelect: false,
    subject: null,
    userSelect: '',
    userScore: 0, //用户答对了几道题
    totalScore: -1, //用户总得分
    totalError: 0, //用户答错几道题
    current: 1 //从第一道题开始
  },
  //一进入页面就会执行的生命周期
  async onShow(e) {
    this.setData({
      percent: 0,
      total: 0,
      isSelect: false,
      subject: null,
      userSelect: '',
      userScore: 0, //用户答对了几道题
      totalScore: -1, //用户总得分
      totalError: 0, //用户答错几道题
      current: 1, //从第一道题开始
      hideButton: false
    })
    //随机题库
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'GET', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'getquestion', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log("随机题库", res.data[0])
        titles = res.data[0]
        let subject = titles[0]
        this.setData({
          subject,
          total: titles.length
        })


    // 答题时提示用需要登陆注册才可以参加排名
    // 发布之前先判断是否登录和注册
    if (!app.globalData.userInfo || !app.globalData.userInfo.name) {
      wx.showModal({
        title: "是否注册参加排名？",
        content: '注册用户才会参加排名，如果您直接做题可以点击取消',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/me/me',
            })
          }
        }
      })
    }


  },
  //用户选择
  selectClick(e) {
    console.log(e.detail.value)
    this.setData({
      userSelect: e.detail.value
    })
  },
  //提交答题,并切换到下一题
  async submit() {
    //1，获取用户选项并判空
    let userSelect = this.data.userSelect

    if (!userSelect || userSelect.length < 1) {
      wx.showToast({
        icon: 'none',
        title: '请做选择',
      })
      return
    }
    //2,如果用户有选择，就更新进度条
    let currentNum = this.data.current
    //更新进度条
    this.setData({
      percent: (currentNum / titles.length * 100).toFixed(1)
    })

    // 用来记录用户做题总数，和每个类型的总数
    let tongjiArr = wx.getStorageSync('tongji') || []
    // 判断当前类型是否有缓存过
    let tongjiItem = tongjiArr.find((v) => {
      return v.type == this.data.subject.type;
    });
    console.log('当前类型', tongjiItem)
    if (!tongjiItem) {
      tongjiItem = {
        type: this.data.subject.type,
        errNum: 0,
        rigthNum: 0,
        totalNum: 0
      }
      tongjiArr.push(tongjiItem)
    }
    // 总的题目加1
    tongjiItem.totalNum = tongjiItem.totalNum + 1

    //3，判断用户是否答对
    if (userSelect instanceof Array) { //多选的时候，把选项转字符串
      console.log('是数组')
      userSelect = userSelect.sort().toString()
    }
    if (this.data.subject.answer.sort().toString() == userSelect) {
      // 正确题目加1
      tongjiItem.rigthNum = tongjiItem.rigthNum + 1

      console.log('用户答对了第' + currentNum + "道题")
      this.setData({
        userScore: this.data.userScore + 1
      })

    } else {
      // 错误题目加1
      tongjiItem.errNum = tongjiItem.errNum + 1

      //4,记录用户答错的题，方便用户查漏补缺
      let subjectNow = this.data.subject
      subjectNow.userSelect = userSelect

      errorOptions.push(subjectNow)
      let temp = {}
      Object.assign(temp, subjectNow)
      delete temp._id
      let userInfo = wx.getStorageSync('user') || {}
      temp.nickName = userInfo && userInfo.nickName ? userInfo.nickName : '未登陆用户'
      console.log('临时错题', temp)
      // 添加用户错题到数据库
      const res = await wx.cloud.callContainer({
        config: {
          env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
        },
        path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
        method: 'POST', // 按照自己的业务开发，选择对应的方法
        header: {
          'X-WX-SERVICE': 'erroperation', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他 header 参数
        },
        data: {
          "action":"add",
          "data":temp
        }
        // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
        // 其余参数同 wx.request
      });
      console.log('添加错题到数据库', res)
      console.log('错题', subjectNow)
    }

    //保存做题数据
    wx.setStorageSync('tongji', tongjiArr)


    // 5,在答完最后一道题的时候，对用户进行打分
    if (currentNum + 1 > titles.length) {
      let totalScore = this.data.userScore
      console.log('用户一共答对了' + totalScore + "道题")
      console.log('用户错题集', errorOptions)
      this.setData({
        totalScore: totalScore,
        totalError: errorOptions.length,
        hideButton: true //最后一题时隐藏按钮
      })
      wx.showToast({
        icon: 'none',
        title: '已经最后一道啦',
      })
      this.addScore(totalScore)
      return
    }

    let subject = titles[currentNum]
    this.setData({
      userSelect: '',
      subject,
      current: currentNum + 1,
      isSelect: false,
    })
  },
  //去查看错题集
  seeError() {
    console.log('点击了查看错题集')
    wx.navigateTo({
      url: '/pages/errorQuestions/errorQuestions'
    })
  },
  //添加积分
  async addScore(score) {
    // 发布之前先判断是否登录和注册,如果没有就不计分
    if (!app.globalData.userInfo || !app.globalData.userInfo.name) {
      return
    }
    try{
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'addscore', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "score":score
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    wx.showToast({
      title: '添加积分成功',
    })
  }catch(err){
    console.log(err)
  }
  
  }
})