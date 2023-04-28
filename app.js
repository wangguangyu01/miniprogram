const config = require('./config')
const themeListeners = []
global.isDemo = true
global.isShare = false
App({
  onLaunch(opts, data) {
    wx.cloud.init();
    // const that = this;
    // const canIUseSetBackgroundFetchToken = wx.canIUse('setBackgroundFetchToken')
    // if (canIUseSetBackgroundFetchToken) {
    //   wx.setBackgroundFetchToken({
    //     token: 'getBackgroundFetchToken',
    //   })
    // }
    // if (wx.getBackgroundFetchData) {
    //   wx.getBackgroundFetchData({
    //     fetchType: 'pre',
    //     success(res) {
    //       that.globalData.backgroundFetchData  = res;
    //       console.log('读取预拉取数据成功')
    //     },
    //     fail() {
    //       console.log('读取预拉取数据失败')
    //       wx.showToast({
    //         title: '无缓存数据',
    //         icon: 'none'
    //       })
    //     },
    //     complete() {
    //       console.log('结束读取')
    //     }
    //   })
    // }
    console.log('App Launch', opts)
    if (data && data.path) {
      wx.navigateTo({
        url: data.path,
      })
    }
    this.loadOpenid();
    this.globalData.openid = wx.getStorageSync("openid");
    this.loadDataUserInfo();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })
    }
  },

  
  onShow(opts) {
    console.log('App Show', opts);
    // console.log(wx.getSystemInfoSync())
  },
  onHide() {
    console.log('App Hide')
  },
  onThemeChange({ theme }) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
        listener(theme)
    })
  },
  watchThemeChange(listener) {
      if (themeListeners.indexOf(listener) < 0) {
          themeListeners.push(listener)
      }
  },
  unWatchThemeChange(listener) {
      const index = themeListeners.indexOf(listener)
      if (index > -1) {
          themeListeners.splice(index, 1)
      }
  },
  globalData: {
    theme: wx.getSystemInfoSync().theme,
    hasLogin: false,
    openid: null,
    iconTabbar: '/page/weui/example/images/icon_tabbar.png',
    userInfo: {},
    hasUser: false
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this
    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.cloud.callFunction({
            name: 'login',
            data: {
              action: 'openid'
            },
            success: res => {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.result.openid
              callback(null, self.globalData.openid);
              console.log("self.globalData.openid")
            },
            fail: err => {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  },
  loadOpenid() {
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
          console.log(res.data.data);
          wx.setStorageSync('openid', res.data.data.openid);
           wx.setStorageSync('hasOpenId', res.data.data.flag)
        }
    })
  },
  async loadDataUserInfo() {
   
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
    if (res.data.data.phone != null ) {
      wx.setStorageSync('hasUser', true);
    } else {
      wx.setStorageSync('hasUser', false);
      wx.switchTab({
        url: '/page/cloud/index'
      })
    }
    return res.data.data;
  },

})
