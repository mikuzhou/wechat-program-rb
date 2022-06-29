// 文件名称：home.js
// 开发者：马子智
// 开发时间：2022.5.22
// 文件功能：主页的业务功能，可以跳转到分类知识，新闻科普，知识竞答，观看视频的界面
const app = getApp()
// 3 建立链接

Page({
  data: {
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
        url: '/pages/search/search?searchKey=' + searchKey + '&type=0',
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '搜索词为空',
      })
    }
  },
  onLoad() {
    this.getLunbotu()

  },
  onShow() {
    this.getVideos()
  },

  // 获取顶部轮播图
  async getLunbotu() {
    try{
    const res = await wx.cloud.callContainer({
      config: {
        env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
      },
      path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
      method: 'GET', // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': 'rollimg', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他 header 参数
      },
      
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });
    console.log('轮播图数据', res.data[0])
    this.setData({
      topList: res.data[0]
    })
  }catch(err){
      console.log(err);
    }

  },
  // 获取视频列表
  async getVideos() {
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
        "action": "getList"
      }
      // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
      // 其余参数同 wx.request
    });

    console.log('视频列表', res.data[0])
    this.setData({
      list: res.data[0]
    })

  },
  // 去视频列表页
  video() {
    wx.navigateTo({
      url: '/pages/video/video',
    })
  },
  // 去视频详情页
  goVideoDetail(e) {
    wx.navigateTo({
      url: '/pages/videoDetail/videoDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 新闻科普
  news() {
    wx.switchTab({
      url: '/pages/news/news',
    })
  },
  // 知识竞答
  questions() {
    wx.switchTab({
      url: '/pages/questions/questions',
    })
  },
  // 分类知识
  sort() {
    wx.switchTab({
      url: '/pages/sort/sort',
    })
  },

  onShareAppMessage: function () {

  },
  onShareTimeline: function () {

  }

})