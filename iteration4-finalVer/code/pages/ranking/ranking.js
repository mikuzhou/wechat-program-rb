// 文件名称：home.js
// 开发者：周凡皓
// 开发时间：2022.6.17
// 文件功能：查看答题的排名
const app = getApp()
Page({
  async onShow() {
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'GET', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'users', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });

    console.log("积分排名", res.data[0])
      this.setData({
        userList: res.data[0]
      })
    // wx.cloud.callFunction({
    //   name: "users"
    // }).then(res => {
    //   console.log("积分排名", res)
    //   this.setData({
    //     userList: res.result.data
    //   })
    // })
  },
  //去答题页
  goQuestions() {
    // 发布之前先判断是否登录和注册
    if (app.globalData.userInfo && app.globalData.userInfo.name) {
      wx.switchTab({
        url: '/pages/questions/questions',
      })
    } else {
      wx.showModal({
        title: "请先注册",
        content: '注册用户后才可以参与积分排名',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/change/change',
            })
          }
        }
      })
    }
  }
})