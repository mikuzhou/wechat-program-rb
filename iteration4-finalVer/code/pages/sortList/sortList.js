
Page({
    data: {
        tabs: ["可回收垃圾", "有害垃圾", "湿垃圾", "干垃圾"],
        // 默认选中菜单
        currentTab: 0,
    },
    // 选中顶部导航栏
    selectTab(event) {
        let index = event.currentTarget.dataset.index
        this.setData({
            currentTab: index,
        })
        this.getList(index)
    },

    onLoad() {
        this.getList()
    },
    async getList() {
        let currentTab = this.data.currentTab
        // wx.cloud.callFunction({
        //     name: 'refuse',
        //     data: {
        //         type: this.data.tabs[currentTab]
        //     }
        // }).then(res => {
        //     console.log('jieguo', res)
        //     this.setData({
        //         datas: res.result.data
        //     })
        // })
        const res = await wx.cloud.callContainer({
            config: {
              env: 'prod-3g2co994269b8929', // 微信云托管的环境ID
            },
            path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
            method: 'POST', // 按照自己的业务开发，选择对应的方法
            header: {
              'X-WX-SERVICE': 'refuse', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
              // 其他 header 参数
            },
            data: {
                "type": this.data.tabs[currentTab],
                "action": "getall"
            }
            // dataType:'text', // 默认不填是以 JSON 形式解析返回结果，若不想让 SDK 自己解析，可以填text
            // 其余参数同 wx.request
          });
      
          console.log('jieguo', res)
            this.setData({
                datas: res.data[0]
            })
    }


})