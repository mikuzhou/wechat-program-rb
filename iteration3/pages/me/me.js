// 文件名称：me.js
// 开发者：周凡皓
// 开发时间：2022.5.20
// 文件功能：“我的”页面的主要展示内容，事件响应
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    userInfo: null,
  },
  onShow(options) {
    var user = app.globalData.userInfo;
    console.log("个人中心user", user)
    if (user && user.nickName) {
      this.setData({
        userInfo: user,
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('user')
      })
    }
    //获取最新积分
    this.getScore()
  },
  // 获取积分
  async getScore() {
    if (!app.globalData.openid) {
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
        'X-WX-SERVICE': 'useroperation', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "get"
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    if (res && res.data && res.data.score > 0) {
      let score = res.data.score;
      console.log('刷新积分', score)
      this.setData({
        score: score
      })
    }
    }catch(err){
      console.log('获取积分失败')
    }
  
    // wx.cloud.database().collection('user')
    //   .doc(app.globalData.openid)
    //   .get()
    //   .then(res => {
    //     if (res && res.data && res.data.score > 0) {
    //       let score = res.data.score;
    //       console.log('刷新积分', score)
    //       this.setData({
    //         score: score
    //       })
    //     }
    //   })
    //   .catch(res => {
    //     console.log('获取积分失败')
    //   })
  },
  //获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo

        app.globalData.userInfo.nickName = user.nickName;
        app.globalData.userInfo.avatarUrl = user.avatarUrl;
        app._saveUserInfo(app.globalData.userInfo);
        this.setData({
          userInfo: app.globalData.userInfo,
        })
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  //退出登录
  tuichu() {
    wx.setStorageSync('user', null)
    this.setData({
      userInfo: null,
    })
  },
  // 去排行榜
  goRanking() {
    wx.navigateTo({
      url: '/pages/ranking/ranking',
    })
  },
  // 去我的错题集
  goMyError() {
    wx.navigateTo({
      url: '/pages/errorQuestions/errorQuestions'
    })
  },
  // 查看我的正确率
  goMyZhengquelv() {
    wx.navigateTo({
      url: '/pages/zhengquelv/zhengquelv'
    })
  },

  //修改个人信息
  change() {
    wx.navigateTo({
      url: '/pages/change/change',
    })
  },
  // 我收藏的文章
  news() {
    wx.navigateTo({
      url: '/pages/collection/collection',
    })
  },
  // 我收藏的视频
    video() {
    wx.navigateTo({
      url: '/pages/collectionVideo/collectionVideo',
    })
  },


})