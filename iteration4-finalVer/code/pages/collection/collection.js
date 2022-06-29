Page({
  onShow() {
    let list = wx.getStorageSync('shoucang')
    console.log('收藏列表', list)
    this.setData({
      list: list
    })
  },
  //去垃圾详情页
  goDetail(event) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + event.currentTarget.dataset.id,
    })
  }
})