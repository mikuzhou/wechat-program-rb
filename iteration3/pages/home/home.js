// 文件名称：home.js
// 开发者：马子智
// 开发时间：2022.5.17
// 文件功能：首页的主要展示内容，事件响应
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