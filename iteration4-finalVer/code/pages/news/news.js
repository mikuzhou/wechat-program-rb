// 文件名称：news.js
// 开发者：马子智
// 开发时间：2022.5.19
// 文件功能：新闻页面的主要展示内容，事件响应
const app = getApp()

Page({
  data: {
    tabs: [],
    tabCur: 0,
    searchKey: ''
  },
  //获取用户输入的内容
  getSearch(e) {
    this.setData({
      searchKey: e.detail.value
    })

  },
  //触发搜索事件
  goSearch() {
    let searchKey = this.data.searchKey
    console.log('触发了搜索', searchKey)
    if (searchKey && searchKey.length > 0) {
      //搜索的触发写在这里
      wx.navigateTo({
        url: '/pages/search/search?searchKey=' + searchKey + '&type=1',
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '搜索词为空',
      })
    }
  },

  //顶部选择分类条目
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.index,
      scrollLeft: (e.currentTarget.dataset.index - 2) * 200
    }, success => {
      this.getList()
    })
  },

  onLoad() {
    this.getLunbotu()
  },
  onShow() {
    this.getForum()
  },
  // 获取顶部轮播图,浏览器最高的前4篇
  async getLunbotu() {
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'news', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "rollimg"
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('轮播图数据', res.data)
    this.setData({
      topList: res.data[0]
    })
    // db.collection('news')
    //   .orderBy('liulan', 'desc')
    //   .limit(4)
    //   .get()
    //   .then(res => {
    //     console.log('轮播图数据', res)
    //     this.setData({
    //       topList: res.data
    //     })
    //   })
  },
  async getForum() {
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'news', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "forum"
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('分类数据', res.data)
        this.setData({
          tabs: res.data[0]
        })
        this.getList()
    // db.collection('news').aggregate()
    //   .group({
    //     _id: '$type',
    //     num: $.sum(1)
    //   })
    //   .sort({
    //     _id: 1
    //   })
    //   .end()
    //   .then(res => {
    //     console.log('分类数据', res)
    //     this.setData({
    //       tabs: res.list
    //     })
    //     this.getList()
    //   })
  },
  async getList() {
    let type = this.data.tabs[this.data.tabCur]._id
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'POST', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'news', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      data: {
        "action": "getList",
        "type":type
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('列表成功', res.data)
        this.setData({
          list: res.data[0]
        })
    // wx.cloud.callFunction({
    //     name: "news",
    //     data: {
    //       action: 'getList',
    //       type: type
    //     }
    //   })
    //   .then(res => {
    //     console.log('列表成功', res)
    //     this.setData({
    //       list: res.result.data
    //     })
    //   })
  },
  // 去垃圾详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage: function () {

  },
  onShareTimeline: function () {

  }

})