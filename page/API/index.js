const app = getApp()

Page({
  onShareAppMessage() {
    return {
      title: '活动信息',
      path: 'page/API/index'
    }
  },

  data: {
    currentPage: 1,
    limit: 10,
    pages: 1,
    total: 0,
    isSetTabBarPage: false,
    theme: 'light',
    triggered: false,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.setData({
      triggered: true,
    })
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 1000)
  },
  onPullDownRefresh: function() {
    console.log("534654765");
    if (this._freshing) return
    this._freshing = true
    this.setData({
      triggered: true,
    })
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 1000);
    let page = wx.getStorageSync('activityPageIndex');
    let limit = this.data.limit;
    page = page - 1;
    if (page < 0 || page == 0) {
       return;
    }
   
    let arrStr = wx.getStorageSync('activityArr');
    let objArr = JSON.parse(arrStr);
    this.setData({
       arr:objArr
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    console.log(app.globalData.userInfo);
    wx.removeStorageSync('activityPages');
    let limit = this.data.limit;
    let page = 1;
    let loadData = this.loadData(page, limit);
    loadData.then((value) => {
      if (value != null) {
        wx.setStorageSync('activityPages', value.pages);
        wx.setStorageSync('activityArr', JSON.stringify(value.records));
        this.setData({
          currentPage: value.current,
          limit: value.size,
          pages: value.pages,
          arr: value.records
        })
      }
    });
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({
        theme
      }) => {
        this.setData({
          theme
        })
      })
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    if (this._freshing) return
    this._freshing = true
    this.setData({
      triggered: true,
    })
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 1000);
    console.log("4576867876")
    let pages = wx.getStorageSync('activityPages')
    let currentPage = this.data.currentPage + 1;
    if ( pages < currentPage) {
       return;
    }
    let limit = this.data.limit;
    let loadData = this.loadData(currentPage, limit);
    loadData.then((value) => {
      console.log(value);
      let obj = null;
      wx.setStorageSync('activityPageIndex', value.current);
      if (wx.getStorageSync('activityArr') !== null && wx.getStorageSync('activityArr') !== '') {
        obj = JSON.parse(wx.getStorageSync('activityArr'));
      }
      let arr = obj.concat(value.records);
      wx.setStorageSync('activityArr', JSON.stringify(arr));
      if (value != null) {
        this.setData({
          currentPage: value.current,
          limit: value.size,
          pages: value.pages,
          arr: arr
        });
      }
    });
  },
  onShow() {
    this.leaveSetTabBarPage()
  },
  onHide() {
    this.leaveSetTabBarPage()
  },
  async loadData(currentPage, limit) {
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/blogContent",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": {
        "categories": "2",
        "limit": limit,
        "currentPage": currentPage
      }
    });
    return res.data.data;
  },
  kindToggle(e) {
    const id = e.currentTarget.id;
    const
      list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        if (list[i].url) {
          wx.navigateTo({
            url: `../../packageAPI/pages/${list[i].id}/${list[i].url}`
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
  enterSetTabBarPage() {
    this.setData({
      isSetTabBarPage: true
    })
  },
  leaveSetTabBarPage() {
    this.setData({
      isSetTabBarPage: false
    })
  },

  getUserProfile() {
    console.log(app.globalData.userInfo);
    if(app.globalData.userInfo != null 
      && JSON.stringify(app.globalData.userInfo) !== "{}") {
        return;
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo; 
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})