const app = getApp()
const db = wx.cloud.database()
Page({

  news() {
    wx.switchTab({
      url: '/pages/news/news',
    })
  },
  // 去答题
  questions() {
    wx.switchTab({
      url: '/pages/questions/questions',
    })
  },
  // 查看分类
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