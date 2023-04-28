const app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: '个人信息',
      path: 'page/cloud/index'
    }
  },

  data: {
    list: [],
    theme: 'light',
    avatarUrl: '',
    nickName: '',
    openid: ''
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light',
      openid: wx.getStorageSync("openid")
    })
    this.loadData();
    if (wx.onThemeChange) {
      wx.onThemeChange(({
        theme
      }) => {
        this.setData({
          theme
        })
      })
    }
    wx.login({
      async success(data) {
        console.log(data);
        const res = await wx.cloud.callContainer({
          "config": {
            "env": "prod-0gws2yp30d12fdb1"
          },
          "path": "/api/checkWxUser",
          "header": {
            "X-WX-SERVICE": "springboot-u4yq",
            'content-type': 'application/json'
          },
          "method": "POST",
          "data": {
            "code": data.code,
          }

        });
        console.log("res openid", res)
        app.globalData.openid = res.data.data.openid;
        wx.setStorageSync('openid', res.data.data.openid);
        wx.setStorageSync('hasOpenId', res.data.data.flag);
      }
    })
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    console.log(id, list)
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        if (list[i].url) {
          console.log(list[i].url)
          wx.navigateTo({
            url: `../../packageCloud/pages/${list[i].url}`
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },
  showInfo() {
    console.log("showInfo 个人信息");
    let flag = wx.getStorageSync("hasOpenId");
    let openid = wx.getStorageSync("openid");
    if (flag) {
      wx.redirectTo({
        url: '../../packageExtend/pages/base/article/article?openid=' + openid
      })
    } else {
      wx.redirectTo({
        url: '../../packageExtend/pages/form/form/form?openid='+ openid
      })
    }
  },
  updateInfo() {
    console.log("updateInfo 个人信息");
    let openid = wx.getStorageSync("openid");
    wx.redirectTo({
      url: '../../packageExtend/pages/form/form/form?openid='+ openid
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  async loadData() {
    let openid = wx.getStorageSync("openid");
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
        "openid": openid
      }
    });
    
    this.setData({
      nickName: res.data.data.nickname,
      avatarUrl: res.data.data.headimgurl
    })
    return res.data.data;
  },

})
