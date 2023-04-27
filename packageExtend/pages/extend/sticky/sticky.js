import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'sticky',
      path: 'packageExtend/pages/extend/sticky/sticky'
    }
  },
  data: {
    openid: "",
    wxUser:{}
  },

  onLoad(options) {
    this.setData({
      openid: options.openid,
      theme: wx.getSystemInfoSync().theme || 'light'
    })
    this.loadData();
  },

  onReady() {
    this.setData({
      container: () => wx.createSelectorQuery().select('#container')
    })
  },
  async loadData() {
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/queryWxUserInfo",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": {
        "openid": this.data.openid
      }
    });
    console.log(res.data.data);
    wx.setNavigationBarTitle({
      title: res.data.data.nickname
    })
    this.setData({
      wxUser: res.data.data
    })
    return res.data.data;
  }
})
