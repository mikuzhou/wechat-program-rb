/**
 * 作者：编程小石头
 * 微信：2501902696
 */
App({
  globalData: {
    userInfo: {},
    openid: null,
    // 配置相关,去百度开发者账号里拿
    client_id: 'wxdc6b6f06078c0d7a',//替换为你的API_key
    client_secret: '984d110e037dfe62904715f5df312d27'//替换为你的SECRET_key
  },
  onLaunch() {
    wx.cloud.init({
      env: 'rb-classification-1e73tn27d25ed2', //云开发初始化
      traceUser: true,
    });
    this.getOpenid()

  },
  // 获取用户openid
  getOpenid: function () {
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      console.log('本地获取openid:' + openidStor);
      app.globalData.openid = openidStor;
      app._getMyUserInfo();
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          console.log('云函数获取openid成功', res.result.openid)
          var openid = res.result.openid;
          wx.setStorageSync('openid', openid)
          app.globalData.openid = openid;
          app._getMyUserInfo();
        },
        fail(res) {
          console.log('云函数获取失败')
        }
      })
    }
  },
  //获取自己后台的user信息
  _getMyUserInfo() {
    let app = this
    //优先拿线上的用户数据，线上没有再拿线下
    wx.cloud.database().collection('user')
      .doc(app.globalData.openid)
      .get()
      .then(res => {
        if (res && res.data) {
          app.globalData.userInfo = res.data;
          console.log('qcl线上获取user', app.globalData.userInfo)
        } else {
          let userStor = wx.getStorageSync('user');
          console.log('qcl本地获取user', userStor)
          if (userStor) {
            app.globalData.userInfo = userStor
          }
        }
      })
      .catch(res => {
        let userStor = wx.getStorageSync('user');
        console.log('本地获取user', userStor)
        if (userStor) {
          app.globalData.userInfo = userStor
        }
      })

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
  // 保存收获地址:地址里包含用户姓名，电话，地址信息
  // _saveAddress: function (address) {
  //   //缓存到sd卡里
  //   wx.setStorageSync('address', address);
  //   console.log(address);
  //   console.log('地址里的电话：' + address.telNumber);
  // },
  // 拼接地址信息
  // _getAddress: function (address) {
  //   var desc = null;
  //   if (address) {
  //     desc = address.provinceName + address.cityName + address.countyName + address.detailInfo;
  //   }
  //   return desc;
  // },
  // 获取用户所在城市，只能同一个城市的跑腿员才能抢单
  // _getCity: function (address) {
  //   var city = null;
  //   if (address) {
  //     city = address.cityName;
  //   }
  //   return city;
  // },
  // 错误提示
  showErrorToastUtils: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '朕知道了',
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