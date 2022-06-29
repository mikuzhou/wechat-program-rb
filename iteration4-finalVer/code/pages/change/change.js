// 文件名称：change.js
// 开发者：周凡皓
// 开发时间：2022.5.26
// 文件功能：注册页面的主要展示内容，事件响应
const app = getApp()
// const DB = wx.cloud.database().collection('user')
let openid = ''
Page({
  data: {
    user: null
  },
  onLoad(option) {
    console.log('修改页openid', app.globalData.openid)
    openid = app.globalData.openid
    this.getUserInfo()
  },
  //获取用户信息
  async getUserInfo() {
    
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
    if(res.data[0]!=null){ 
      console.log('获取用户信息成功', res.data[0])
    this.setData({
      user: res.data[0]
    })}
    else{
      wx.showToast({
        icon: 'error',
        title: '还未注册用户',
      })
      console.log('获取用户信息失败')
      this.setData({
        user: null
      })
    }
   
      
    // DB.doc(openid).get()
    //   .then(res => {
    //     console.log('获取用户信息成功', res)
    //     this.setData({
    //       user: res.data
    //     })
    //   })
    //   .catch(res => {
    //     wx.showToast({
    //       icon: 'error',
    //       title: '还未注册用户',
    //     })
    //     console.log('获取用户信息失败')
    //     this.setData({
    //       user: null
    //     })
    //   }).catch(res=>{
    //     console.log('还未注册')
    //   })
  },
  //提交修改
  async formSubmit(e) {
    let user = e.detail.value
    console.log(user)
    if (!user.name) {
      wx.showToast({
        icon: 'none',
        title: '请填写姓名',
      })
    } else if (!user.age) {
      wx.showToast({
        icon: 'none',
        title: '请填写年龄',
      })
    } else if (!user.phone) {
      wx.showToast({
        icon: 'none',
        title: '请填写电话',
      })
    } else { //所有内容都不为空，才提交数据
      if (this.data.user && this.data.user.name) { //已经添加过，就做修改操作
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
            "action": "change",
            "name": user.name,
            "age": user.age,
            "phone": user.phone,
            "nickName": app.globalData.userInfo.nickName,
            "avatarUrl": app.globalData.userInfo.avatarUrl
          }
          // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
          // 其余参数同 wx.request
        });
        this.savaStudent(user)
          wx.showToast({
            title: '添加成功',
          })
        }catch(err){
          console.log(err)
        }
        // DB.doc(openid).update({
        //   data: {
        //     name: user.name,
        //     age: user.age,
        //     phone: user.phone,
        //     nickName: app.globalData.userInfo.nickName,
        //     avatarUrl: app.globalData.userInfo.avatarUrl
        //   }
        // }).then(res => {
        //   this.savaStudent(user)
        //   wx.showToast({
        //     title: '添加成功',
        //   })
        // })
      } else { //没有添加过，做add操作
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
            "action": "add",
            "name": user.name,
            "age": user.age,
            "phone": user.phone,
            "nickName": app.globalData.userInfo.nickName,
            "avatarUrl": app.globalData.userInfo.avatarUrl
          }
          // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
          // 其余参数同 wx.request
        });
        this.savaStudent(user)
        wx.showToast({
          title: '修改成功',
        })
      }catch(err){
        console.log(err)
      }
        // DB.add({
        //   data: {
        //     _id: openid,
        //     name: user.name,
        //     age: user.age,
        //     phone: user.phone,
        //     nickName: app.globalData.userInfo.nickName,
        //     avatarUrl: app.globalData.userInfo.avatarUrl,
        //     score: 0
        //   }
        // }).then(res => {
        //   this.savaStudent(user)
        //   wx.showToast({
        //     title: '修改成功',
        //   })
        // })
      }
    }
  },
  savaStudent(user) {
    app.globalData.userInfo.name = user.name;
    app.globalData.userInfo.xuehao = user.xuehao;
    app.globalData.userInfo.kahao = user.kahao;
    app.globalData.userInfo.yuanxi = user.yuanxi;
    app._saveUserInfo(app.globalData.userInfo);
  }
})