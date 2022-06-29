
Page({
  data: {},
  //获取所有题目类型
  onShow() {
    let list = wx.getStorageSync('tongji') || []
    let total = 0
    let errTotal = 0
    let rigthTotal = 0
    let zongZhengquelv = 0
    list.forEach(item => {
      total = total + item.totalNum
      errTotal = errTotal + item.errNum
      rigthTotal = rigthTotal + item.rigthNum
      item.zhengquelv = (item.rigthNum / item.totalNum * 100).toFixed(2)
    })
    zongZhengquelv = (rigthTotal / total * 100).toFixed(2)
    console.log('做的总题目数', total)
    console.log('做的错误总题目数', errTotal)
    this.setData({
      list,
      total,
      errTotal,
      zongZhengquelv
    })
  },


})