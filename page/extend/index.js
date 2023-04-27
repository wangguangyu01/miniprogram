import CustomPage from './base/CustomPage'
CustomPage({
  onShareAppMessage() {
    return {
      title: '嘉宾展示',
      path: 'page/extend/index'
    }
  },
  data: {
    title: "嘉宾展示",
    list: [],
    triggered: false,
    theme: 'light',
    currentPage: 1,
    limit: 10,
    pages: 1,
    total: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    birthdaySexSearch: "",
    regionSexSearch: ""
  },
  
  themeToggle() {
    const App = getApp()

    if (App.themeChanged) {
      if (App.globalData.theme === 'light') {
        App.themeChanged('dark')
      } else {
        App.themeChanged('light')
      }
    }
  },
  onLoad() {
     console.log("fdsgd",123444);
     let limit = this.data.limit;
     let page = 1;
     let birthdaySexSearch = this.data.birthdaySexSearch;
     let regionSexSearch = this.data.regionSexSearch;
     let loadData = this.loadData(birthdaySexSearch, regionSexSearch,page, limit);
     loadData.then((value) => {
      if (value != null) {
        wx.setStorageSync('wxUserPages', value.pages);
        wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
        this.setData({
          currentPage: value.current,
          limit: value.size,
          pages: value.pages,
          list: value.records
        })
      }
    });
  },
  async loadData(birthdaySexSearch, regionSexSearch, currentPage, limit) {
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/queryWxUserPage",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": {
        "categories": "1",
        "limit": limit,
        "currentPage": currentPage,
        "birthdaySexSearch": birthdaySexSearch,
        "regionSexSearch": regionSexSearch
      }
    });
    return res.data.data;
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    console.log("534654765");
    wx.removeStorageSync('wxUserPages');
    let limit = this.data.limit;
     let page = 1;
     let birthdaySexSearch = this.data.birthdaySexSearch;
     let regionSexSearch = this.data.regionSexSearch;
     let loadData = this.loadData(birthdaySexSearch, regionSexSearch,page, limit);
     loadData.then((value) => {
      if (value != null) {
        wx.setStorageSync('wxUserPages', value.pages);
        wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
        this.setData({
          currentPage: value.current,
          limit: value.size,
          pages: value.pages,
          list: value.records
        })
        wx.stopPullDownRefresh();
      }
    });
  
   
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
  // 上拉触底分页查询
  onReachBottom: function() {
    let pages = wx.getStorageSync('wxUserPages')
    let currentPage = this.data.currentPage + 1;
    let birthdaySexSearch = this.data.birthdaySexSearch;
    let regionSexSearch = this.data.regionSexSearch;
    if ( pages < currentPage) {
       return;
    }
    let limit = this.data.limit;
    let loadData = this.loadData(birthdaySexSearch,regionSexSearch, currentPage, limit);
    loadData.then((value) => {
      console.log(value);
      let obj = null;
      wx.setStorageSync('wxUserPageIndex', value.current);
      if (wx.getStorageSync('wxUserArr') !== null && wx.getStorageSync('wxUserArr') !== '') {
        obj = JSON.parse(wx.getStorageSync('wxUserArr'));
      }
      let arr = obj.concat(value.records);
      wx.setStorageSync('wxUserArr', JSON.stringify(arr));
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
  // 80后女
  search80WomanLoadData(e) {
    console.log(3324343);
     this.setData({
        birthdaySexSearch: "1"
     })
     let birthdaySexSearch = this.data.birthdaySexSearch;
     let regionSexSearch = this.data.regionSexSearch;
     let loadData = this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
     loadData.then((value) => {
      if (value != null) {
        wx.setStorageSync('wxUserPages', value.pages);
        wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
        this.setData({
          currentPage: value.current,
          limit: value.size,
          pages: value.pages,
          list: value.records
        })
      }
    });
  },
  // 80后男
  search80ManLoadData(e) {
    this.setData({
       birthdaySexSearch: "2"
    })
    let birthdaySexSearch = this.data.birthdaySexSearch;
    let regionSexSearch = this.data.regionSexSearch;
    let loadData = this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
    loadData.then((value) => {
     if (value != null) {
       wx.setStorageSync('wxUserPages', value.pages);
       wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
       this.setData({
         currentPage: value.current,
         limit: value.size,
         pages: value.pages,
         list: value.records
       })
     }
   })
 },
   // 90后女
   search90WomanLoadData(e) {
    this.setData({
       birthdaySexSearch: "3"
    })
    let birthdaySexSearch = this.data.birthdaySexSearch;
    let regionSexSearch = this.data.regionSexSearch;
    let loadData =  this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
    loadData.then((value) => {
     if (value != null) {
       wx.setStorageSync('wxUserPages', value.pages);
       wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
       this.setData({
         currentPage: value.current,
         limit: value.size,
         pages: value.pages,
         list: value.records
       })
     }
   })
 },

 // 90后男
 search90manLoadData(e) {
  this.setData({
     birthdaySexSearch: "4"
  })
  let birthdaySexSearch = this.data.birthdaySexSearch;
  let regionSexSearch = this.data.regionSexSearch;
  let loadData =  this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
  loadData.then((value) => {
   if (value != null) {
     wx.setStorageSync('wxUserPages', value.pages);
     wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
     this.setData({
       currentPage: value.current,
       limit: value.size,
       pages: value.pages,
       list: value.records
     })
   }
 })
},
// 京户女
searchBeijingWomanLoadData(e) {
  this.setData({
    birthdaySexSearch: "",
    regionSexSearch: "1"
  })
  let birthdaySexSearch = this.data.birthdaySexSearch;
  let regionSexSearch = this.data.regionSexSearch;
  let loadData =  this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
  loadData.then((value) => {
   if (value != null) {
     wx.setStorageSync('wxUserPages', value.pages);
     wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
     this.setData({
       currentPage: value.current,
       limit: value.size,
       pages: value.pages,
       list: value.records
     })
   }
 })
},
// 京户男
searchBeijingManLoadData(e) {
  this.setData({
    birthdaySexSearch: "",
    regionSexSearch: "2"
  })
  let birthdaySexSearch = this.data.birthdaySexSearch;
  let regionSexSearch = this.data.regionSexSearch;
  let loadData = this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
  loadData.then((value) => {
   if (value != null) {
     wx.setStorageSync('wxUserPages', value.pages);
     wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
     this.setData({
       currentPage: value.current,
       limit: value.size,
       pages: value.pages,
       list: value.records
     })
   }
 })
},
// 京户男
searchLoadData(e) {
  this.setData({
    birthdaySexSearch: "",
    regionSexSearch: ""
  })
  let birthdaySexSearch = this.data.birthdaySexSearch;
  let regionSexSearch = this.data.regionSexSearch;
  let loadData = this.loadData(birthdaySexSearch,regionSexSearch, 1, 10);
  loadData.then((value) => {
   if (value != null) {
     wx.setStorageSync('wxUserPages', value.pages);
     wx.setStorageSync('wxUserArr', JSON.stringify(value.records));
     this.setData({
       currentPage: value.current,
       limit: value.size,
       pages: value.pages,
       list: value.records
     })
   }
 })
},

})
