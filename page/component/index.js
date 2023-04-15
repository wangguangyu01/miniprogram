const app = getApp()
Page({

  data: {
    title: "历次活动展示",
    arr: [],
    triggered: false,
    theme: 'light',
    currentPage: 1,
    limit: 10,
    pages: 1,
    total: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
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
    let page = wx.getStorageSync('wonderfulPageIndex');
    let limit = this.data.limit;
    page = page - 1;
    if (page < 0 || page == 0) {
       return;
    }
   
    let arrStr = wx.getStorageSync('wonderfulArr');
    let objArr = JSON.parse(arrStr);
    this.setData({
       arr:objArr
    });
    wx.stopPullDownRefresh();
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

  scrollToLower() {
    let pages = wx.getStorageSync('wonderfulPages');
    let currentPage = this.data.currentPage + 1;
    if ( pages < currentPage) {
       return;
    }
    let limit = this.data.limit;
    let loadData = this.loadData(currentPage, limit);
    loadData.then((value) => {
      console.log(value);
      if (value != null) {
        this.setData({
          currentPage: value.current,
          limit: value.size,
          pages: value.pages,
          arr: value.records
        });
      }
    });
  },

  onShow() {
    wx.reportAnalytics('enter_home_programmatically', {})

    // http://tapd.oa.com/miniprogram_experiment/prong/stories/view/1020425689866413543
    if (wx.canIUse('getExptInfoSync')) {
      console.log('getExptInfoSync expt_args_1', wx.getExptInfoSync(['expt_args_1']))
      console.log('getExptInfoSync expt_args_2', wx.getExptInfoSync(['expt_args_2']))
      console.log('getExptInfoSync expt_args_3', wx.getExptInfoSync(['expt_args_3']))
    }
    if (wx.canIUse('reportEvent')) {
      wx.reportEvent('expt_event_1', {
        expt_data: 1
      })
      wx.reportEvent('expt_event_2', {
        expt_data: 5
      })
      wx.reportEvent('expt_event_3', {
        expt_data: 9
      })
      wx.reportEvent('expt_event_4', {
        expt_data: 200
      })

      wx.reportEvent('weexpt_event_key_1', {
        option_1: 1,
        option_2: 10,
        option_str_1: 'abc'
      })
      wx.reportEvent('weexpt_event_key_1', {
        option_1: 'abc',
        option_2: '1000',
        option_str_1: '1'
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '历次活动展示',
      path: 'page/component/index'
    }
  },


  onShareTimeline() {
    '历次活动展示'
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  
    wx.removeStorageSync('wonderfulPages');
    let limit = this.data.limit;
    let page = 1;
    let loadData = this.loadData(page, limit);
    loadData.then((value) => {
      if (value != null) {
        wx.setStorageSync('wonderfulPages', value.pages);
        wx.setStorageSync('wonderfulArr', JSON.stringify(value.records));
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
  onReachBottom: function() {
    
    console.log(app.globalData.userInfo);
    let pages = wx.getStorageSync('wonderfulPages')
    let currentPage = this.data.currentPage + 1;
    if ( pages < currentPage) {
       return;
    }
    let limit = this.data.limit;
    let loadData = this.loadData(currentPage, limit);
    loadData.then((value) => {
      console.log(value);
      let obj = null;
      wx.setStorageSync('wonderfulPageIndex', value.current);
      if (wx.getStorageSync('wonderfulArr') !== null && wx.getStorageSync('wonderfulArr') !== '') {
        obj = JSON.parse(wx.getStorageSync('wonderfulArr'));
      }
      let arr = obj.concat(value.records);
      wx.setStorageSync('wonderfulArr', JSON.stringify(arr));
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
  unCloseMode: function() {
    console.log("dsafds");
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
        "categories": "1",
        "limit": limit,
        "currentPage": currentPage
      }
    });
    return res.data.data;
  },

  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    wx.reportAnalytics('click_view_programmatically', {})
  }
})
