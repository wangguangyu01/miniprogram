const example = require('./example.js')
const app = getApp();
// Page({
//   onShareAppMessage() {
//     return {
//       title: '创建画布',
//       path: 'packageAPI/pages/page/canvas/canvas'
//     }
//   },

//   onLoad() {
//     this.setData({
//       theme: wx.getSystemInfoSync().theme || 'light'
//     })

//     if (wx.onThemeChange) {
//       wx.onThemeChange(({theme}) => {
//         this.setData({theme})
//       })
//     }
//     this.context = wx.createContext()

//     const methods = Object.keys(example)
//     this.setData({
//       methods
//     })

//     const that = this
//     methods.forEach(function (method) {
//       that[method] = function () {
//         example[method](that.context)
//         const actions = that.context.getActions()

//         wx.drawCanvas({
//           canvasId: 'canvas',
//           actions
//         })
//       }
//     })
//   },

//   toTempFilePath() {
//     wx.canvasToTempFilePath({
//       canvasId: 'canvas',
//       success(res) {
//         console.log(res)
//       },

//       fail(res) {
//         console.log(res)
//       }
//     })
//   }
// })
Page({
  data: {
    theme: 'light',
    title: '',
    uuid: '',
    content: '',
    fileUrlArr: [],
    moneyQRCode: ''
    
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
          fileUrlArr: value.fileList,
          moneyQRCode: value.moneyQRCode
        })
      }
    });

  },
  onShareAppMessage() {
    return {
      title: 'view',
      path: 'packageAPI/pages/page/canvas/canvas'
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

  async gotoRegister() {
    let uuid = this.data.uuid;
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
          app.globalData.openid = res.data.data.openid;
         
          if(!res.data.data.flag) {
            wx.redirectTo({
              url: '../../../../packageExtend/pages/form/form/form?openid='+ res.data.data.openid+"&categories=2&uuid="+uuid
            })
          }
        }
    })
  },
  previewImage(e) {
    let itemUrlId = e.target.id;
    if (itemUrlId.includes('itemUrl')) {
      let index = itemUrlId.substring(itemUrlId.indexOf("_")+1);
      console.log(index);
      let imagePaths = this.data.fileUrlArr;
      console.log(imagePaths);
      let current = imagePaths[index];
      console.log(current);
      wx.previewImage({
        urls: [current]
      })
    }
 
  }
})
