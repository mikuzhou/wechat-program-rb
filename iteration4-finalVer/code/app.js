
App({
  globalData: {
    userInfo: {},
    openid: null,
    client_id: 'wxdc6b6f06078c0d7a',
    client_secret: '984d110e037dfe62904715f5df312d27'
  },
  async onLaunch() {
    await wx.cloud.init();
 
    this.getOpenid()

  },
  
  // 获取用户openid
  getOpenid: function () {
    console.log("here")
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      console.log('本地获取openid:' + openidStor);
      app.globalData.openid = openidStor;
      app._getMyUserInfo();
    } else {
 
      const result = wx.cloud.callContainer({
        config: {
          env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
        },
        path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
        method: 'GET', // 按照自己的业务开发，选择对应的方法
        header: {
          'X-WX-SERVICE': 'getopenid', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        }
        // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      })
      console.log(result)
    }
  },
  //获取自己后台的user信息
 async _getMyUserInfo() {
    let app = this
    //优先拿线上的用户数据，线上没有再拿线下
   try{
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'userinfo', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "_id":app.globalData.openid
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    if (res && res.data[0]) {
      app.globalData.userInfo = res.data[0];
      console.log('qcl线上获取user', app.globalData.userInfo)
    } else {
      let userStor = wx.getStorageSync('user');
      console.log('qcl本地获取user', userStor)
      if (userStor) {
        app.globalData.userInfo = userStor
      }
    }
   }catch{
    let userStor = wx.getStorageSync('user');
    console.log('本地获取user', userStor)
    if (userStor) {
      app.globalData.userInfo = userStor
    }
   }


  },
  // 保存userinfo
  _saveUserInfo: function (user) {
    console.log("保存的userinfo", user)
    this.globalData.userInfo = user;
    wx.setStorageSync('user', user)
  },
  // 获取当前时间
  _getCurrentTime(date) {
    var d = new Date();
    if (date) {
      var d = new Date(date);
    }
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    var curDateTime = d.getFullYear() + '年';
    if (month > 9)
      curDateTime += month + '月';
    else
      curDateTime += month + '月';

    if (date > 9)
      curDateTime = curDateTime + date + "日";
    else
      curDateTime = curDateTime + date + "日";
    if (hours > 9)
      curDateTime = curDateTime + hours + "时";
    else
      curDateTime = curDateTime + hours + "时";
    if (minutes > 9)
      curDateTime = curDateTime + minutes + "分";
    else
      curDateTime = curDateTime + minutes + "分";
    return curDateTime;
  },

  showErrorToastUtils: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: 'ok',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },



})