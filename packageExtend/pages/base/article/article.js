import CustomPage from '../../../base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'article',
      path: 'packageExtend/pages/base/article/article'
    }
  },
  data: {
    openid: "",
    wxUser:{},
    hasUser: false
  },
  onLoad(options) {
    console.log("options.openid", options.openid);
    this.setData({
      openid: options.openid,
      theme: wx.getSystemInfoSync().theme || 'light'
    })
    this.loadData();
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
    if (res.data.data != null) {
      wx.setNavigationBarTitle({
        title: res.data.data.nickname
      })
      this.setData({
        wxUser: res.data.data,
        hasUser: true
      })
    }
    return res.data.data;
  },
previewImage(e) {
    let itemUrlId = e.target.id;
    let index = itemUrlId.substring(itemUrlId.indexOf("_")+1);
    console.log(index);
    let imagePaths = this.data.wxUser.imagePaths;
    let url = imagePaths[index];
    console.log(url);
    let current = url.url;
    wx.previewImage({
      urls: [current]
    })
  }
})
