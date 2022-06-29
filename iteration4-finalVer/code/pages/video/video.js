// 文件名称：home.js
// 开发者：马子智
// 开发时间：2022.6.14
// 文件功能：视频主页面的业务功能
Page({
    async onShow() {
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
    // 去新详情页
    goDetail(e) {
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: '/pages/videoDetail/videoDetail?id=' + e.currentTarget.dataset.id,
        })

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})