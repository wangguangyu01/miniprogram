Page({
  data: {
    theme: 'light',
    title: '',
    uuid: '',
    content: '',
    fileUrlArr: []
    
  },
  onLoad: function (options) {
    this.setData({
      uuid: options.uuid,
      theme: wx.getSystemInfoSync().theme || 'light'
    })
    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
    let loadData = this.loadData();
    loadData.then((value) => {
      if (value != null) {
        this.setData({
          title: value.title,
          content: value.content,
          uuid: value.uuid,
          fileUrlArr: value.fileList
        })
      }
    });

  },
  onShareAppMessage() {
    return {
      title: 'view',
      path: 'packageComponent/pages/view/view/view'
    }
  },
  async loadData() {
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/blogContentInfo",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": {
        "uuid": this.data.uuid,
      }
    });
    console.log(res.data.data);
    wx.setNavigationBarTitle({
      title: res.data.data.title
    })
    return res.data.data;
  },
})
