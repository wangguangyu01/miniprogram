import CustomPage from '../../../base/CustomPage'
const app = getApp();
CustomPage({
  onShareAppMessage() {
    return {
      title: 'uploader',
      path: 'page/weui/example/uploader/uploader'
    }
  },
  data: {
    files: [],
    uuid: '',
    categories: '',
    filePaths: [],
    openid: ""
  },
  onLoad(options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
      uuid: options.uuid,
      categories: options.categories
    })
    let hasOpenId = wx.getStorageSync("hasOpenId");
    if (hasOpenId) {
      this.loadData();
    }

  },
  chooseImage() {
    const that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log("chooseImage");
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        })
      }
    })
    // wx.chooseMessageFile({
    //   count: 5,
    //   type: 'all',
    //   success(res) {
    //     console.log(res)
    //     var src = res.tempFiles
    //     let tempFilePathsImg = that.data.src
    //     // 获取当前已上传的图片的数组
    //     var tempFilePathsImgs = tempFilePathsImg.concat(src)
    //     that.setData({
    //       files: tempFilePathsImgs
    //     })
    //     console.log(that.data.files, '文件上传')
    //   }
    // })
  },
  previewImage(e) {
    console.log("fdsgfdhf");
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('filesttttt', files);
  },
  uplaodFile(files) {
    // console.log(this.getuuid());
    console.log('upload files', files);
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      for (let i = 0; i < files.tempFiles.length; i++) {
        const uuid = this.getuuid().replaceAll("-", "");
        console.log("vdvdf" + uuid);
        let path = files.tempFiles[i].path;
        let endIndex = path.lastIndexOf('.') + 1;
        console.log(endIndex);
        const type = files.tempFiles[i].path.substring(endIndex);
        const imageNewName = uuid + "." + type;
        wx.cloud.uploadFile({
          cloudPath: imageNewName, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
          filePath: path, // 微信本地文件，通过选择图片，聊天文件等接口获取
          config: {
            env: 'prod-0gws2yp30d12fdb1' // 需要替换成自己的微信云托管环境ID
          }
        }).then(res => {
          console.log(res.fileID);
          this.submitFile(res.fileID);
          let file = {};
          file.url = res.fileID;
          file.loading = false;
          let arr = [];
          if (this.data.files.length !== 0) {
            let arrNew = this.data.files.concat(arr);
            arrNew.push(file);
            this.setData({
              files: arrNew
            })
          } else {
            arr.push(file);
            this.setData({
              files: arr
            })
          }
        }).catch(error => {
          console.error(err)
        })
      }

    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload Success', e.detail)
  },
  getuuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  async submitFile(fileid) {
    console.log("filePaths-->", fileid);
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/uploadFile",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": {
        openId: app.globalData.openid,
        fileid: fileid
      }
    });
  },
  async binddelete(e) {
    console.log("binddelete", 
    e.detail.item.url);
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/fileDelete",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": {
        openid: app.globalData.openid,
        fileid: e.detail.item.url
      }
    });
    console.log("binddelete--->", res);
  },
  gotoResource() {
    console.log("fdgfd");
    wx.redirectTo({
      url: '../../base/article/article?openid='+app.globalData.openid
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
        "openid": app.globalData.openid
      }
    });
    console.log(res.data.data);
    console.log(res.data.data.imagePaths);
    const fileList = [];
    if (res.data.data.imagePaths !== null) {
      for (let i = 0; i < res.data.data.imagePaths.length; i++) {
        let fileurl = {};
         console.log(res.data.data.imagePaths[i].fileId);
         fileurl.url = res.data.data.imagePaths[i].fileId;
         fileList.push(fileurl);
     }
     this.setData({
      files: fileList,
      openid: res.data.data.openId
    })
    }
    
    
    
  }
})
