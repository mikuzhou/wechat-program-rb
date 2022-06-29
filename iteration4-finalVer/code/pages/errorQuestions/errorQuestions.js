// 文件名称：errorQuestions.js
// 开发者：马子智
// 开发时间：2022.6.5
// 文件功能：错题集的主要展示内容，事件响应
const app = getApp()
// const db = wx.cloud.database()
let options = null
let titles = []

Page({
  data: {
    total: 0,
    current: 0 //0代表第一个
  },
  onLoad(e) {
    options = e
    this.getData()
  },
  //获取错题数据
  async getData() {
    try{
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
        "action": "get"
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    titles = res.data[0]
        console.log("错题题库", titles)
        let subject = titles[0]
        console.log('当前错题', subject)
        this.setData({
          current: 0,
          subject,
          total: titles.length
        })
      }catch(err){
        console.log(err)
      }

  },
  //上一个错题
  pre() {
    let currentNum = this.data.current
    if (currentNum <= 0) {
      wx.showToast({
        icon: "error",
        title: '已是第一道',
      })
    } else {
      currentNum = currentNum - 1
      this.setData({
        current: currentNum,
        subject: titles[currentNum],
      })
    }
  },
  //下一个错题
  next() {
    let currentNum = this.data.current
    if (currentNum >= titles.length - 1) {
      wx.showToast({
        icon: "error",
        title: '已是最后一道',
      })
    } else {
      currentNum = currentNum + 1
      this.setData({
        current: currentNum,
        subject: titles[currentNum],
      })
    }
  },
  //删除错题
  async removeError(e) {
    let id = e.currentTarget.dataset.subject._id
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'deleteerr', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "id":id
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('删除错题', res)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '删除成功',
          })
          this.getData()
        }
        else {
          wx.showToast({
            icon: 'error',
            title: '网络不给力',
          })
        }

  }
})