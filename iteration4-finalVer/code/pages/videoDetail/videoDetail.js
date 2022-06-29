// 文件名称：home.js
// 开发者：周凡皓
// 开发时间：2022.6.19
// 文件功能：视频详情页
const app = getApp()
const db = wx.cloud.database()
let id = ''
Page({
  data: {
    shouCangNum: 0, //收藏人数
    isShouCang: false //是否收藏
  },
  async onLoad(opt) {
    console.log("传进来的id：" + opt.id)
    id = opt.id
    try{
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'videofun', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "getbyid",
        "id":opt.id
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    
    console.log('详情页请求成功', res.data[0])
        let bean = res.data[0][0]
        console.log('是否收藏', this.checkShouCang(bean._id))
        this.setData({
          detail: res.data[0][0],
          time: app._getCurrentTime(bean._createTime),
          shouCangNum: bean.shoucang,
          liulanNum: bean.liulan,
          isShouCang: this.checkShouCang(bean._id)
        })
        this.addViews()
      }catch(err){
        console.log('详情页请求失败', err)
      }
      

    this.getHot()
    // 获取评论
    this.getAnswer()
  },
  //增加浏览量
  async addViews() {
    //修改数据库里的收藏人数
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'videofun', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "liulan",
        "id":id
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('增加浏览量结果', res)
  },
  //点击了收藏按钮
  async shoucang(event) {
    let detail = event.currentTarget.dataset.detail
    let list = wx.getStorageSync('shoucangVideo')
    if (!list) {
      list = []
    }
    let isShouCang = this.checkShouCang(detail._id)
    if (isShouCang) { //如果已经收藏，就取消收藏
      wx.showToast({
        title: '取消了收藏',
      })
      let index = list.findIndex(item => {
        return item._id == detail._id
      })
      list.splice(index, 1)
      isShouCang = false
    } else { //没有收藏，就保存收藏
      wx.showToast({
        title: '收藏成功',
      })
      delete detail._createTime //删除无用字段
      delete detail._updateTime //删除无用字段
      delete detail.content //删除无用字段
      list.push(detail)
      isShouCang = true
    }
    wx.setStorageSync('shoucangVideo', list)
    let num = this.data.shouCangNum
    this.setData({
      shouCangNum: isShouCang ? ++num : --num,
      isShouCang: isShouCang
    })
    //修改数据库里的收藏人数
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'videofun', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "shoucang",
        "id": detail._id,
        "num": isShouCang ? 1 : -1
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('收藏结果', res)
  },

  //检查是否收藏了本篇文章
  checkShouCang(id) {
    let list = wx.getStorageSync('shoucangVideo')
    if (list && list.length > 0) {
      let res = list.findIndex(item => {
        return item._id == id
      })
      return res != -1
    }
    return false
  },
  // 热门推荐
  async getHot() {
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'videofun', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "gethot"
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('浏览量最高的2篇', res.data[0])
        this.setData({
          hotList: res.data[0]
        })

  },
  // 去垃圾详情页
  goDetail(e) {
    wx.redirectTo({
      url: '/pages/videoDetail/videoDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 评论相关
   */
  // 获取回答列表
  async getAnswer() {
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'answer', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "get",
        "id": id
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    this.setData({
      list: res.data[0]
    })
  },

  // 发布回答
  async publish() {
    let user = wx.getStorageSync('user')
    if (!user || !user.nickName) {
      wx.showToast({
        icon: 'error',
        title: '请先登录',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/me/me',
        })
      }, 1000);
      return
    }
    wx.showModal({
      title: '留下您的评论',
      editable: true,
      success:async res =>{
        if (res.confirm) {
          if (res.content) {
            const result = await wx.cloud.callContainer({
              config: {
                env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
              },
              path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
              method: 'POST', // 按照自己的业务开发，选择对应的方法
              header: {
                'X-WX-SERVICE': 'answer', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
                // 其他 header 参数
              },
              data: {
                "action": "add",
                "forumId": id,
                "forumName": this.data.detail.title,
                "content": res.content,
                "name": user.nickName,
                "avatarUrl": user.avatarUrl,
                "type": 1, //1图文，2视频
                "_createTime": new Date().getTime() //创建的时间
              }
              // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
              // 其余参数同 wx.request
            });
            console.log('评论成功', result)
              wx.showToast({
                title: '评论成功',
              })
              this.getAnswer()
            
          } else {
            wx.showToast({
              icon: 'error',
              title: '请输入内容',
            })
          }
        }
      }
    })
  },
})