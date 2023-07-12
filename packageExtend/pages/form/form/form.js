import CustomPage from '../../../base/CustomPage';

const app = getApp();

CustomPage({
  onShareAppMessage() {
    return {
      title: '用户注册',
      path: 'page/weui/example/form/form'
    }
  },
  data: {
    showTopTips: false,
    categories: '',
    uuid: '',
    avatarUrl: '',
    radioItems: [{
        name: 'sex',
        value: '男',
        checked: true
      },
      {
        name: 'sex',
        value: '女'
      }],
    checkboxItems: [{
        name: 'standard is dealt for u.',
        value: '0',
        checked: true
      },
      {
        name: 'standard is dealicient for u.',
        value: '1'
      }
    ],
    items: [{
        name: 'USA',
        value: '美国'
      },
      {
        name: 'CHN',
        value: '中国',
        checked: 'true'
      },
      {
        name: 'BRA',
        value: '巴西'
      },
      {
        name: 'JPN',
        value: '日本'
      },
      {
        name: 'ENG',
        value: '英国'
      },
      {
        name: 'TUR',
        value: '法国'
      },
    ],
    birthday: '2016-09-01',
    time: '12:01',

    countryCodes: ['+86', '+80', '+84', '+87'],
    countryCodeIndex: 0,

    countries: ['中国', '美国', '英国'],
    countryIndex: 0,

    accounts: ['微信号', 'QQ', 'Email'],
    accountIndex: 0,
    region: ['北京', '北京', '海淀区'],
    customItem: '北京',
    isAgree: false,
    formData: {

    },
    rules: [{
        name: 'sex',
        rules: {
          required: false,
          message: '请选择性别'
        },
      },
       {
         name: 'nickname',
         rules: {
          required: true,
          message: '请输入微信昵称'
        },
       },
      {
        name: 'wxNumber',
        rules: {
          required: true,
          message: '请输入能添加的微信号'
        },
      },
      // {
      //   name: 'qq',
      //   rules: {required: true, message: 'qq必填'},
      // }, 
      {
        name: 'phone',
        rules: [{
          required: true,
          message: '手机号必填'
        }, {
          mobile: true,
          message: '手机号格式不正确'
        }],
      },
      {
        name: 'personProfile',
        rules: {
          required: true,
          message: '请填写个人介绍'
        },
      },
      {
        name: 'matingRequirement',
        rules: {
          required: true,
          message: '请填写择偶要求'
        },
      },
      //  {
      //   name: 'vcode',
      //   rules: {required: true, message: '验证码必填'},
      // }, 
      // {
      //   name: 'idcard',
      //   rules: {
      //     validator(rule, value) {
      //       if (!value || value.length !== 18) {
      //         return 'idcard格式不正确'
      //       }
      //       return ''
      //     }
      //   },
      // },
    ]
  },
  onLoad: function (options) {
    let hasOpenId = wx.getStorageSync("hasOpenId");
    this.setData({
      'formData.openId': options.openid,
      'formData.phone': '',
      categories: options.categories,
      uuid: options.uuid
    })
    if (hasOpenId) {
      this.loadData();
    }

  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const radioItems = this.data.radioItems
    for (let i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value === e.detail.value
    }

    this.setData({
      radioItems,
      'formData.sex': e.detail.value
    })
  },
  changeSeekingFlag(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const radioItems = this.data.radioItems
    for (let i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value === e.detail.value
    }

    this.setData({
      radioItems,
      'formData.marriageSeekingFlag': e.detail.value
    })
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const checkboxItems = this.data.checkboxItems;
    const
      values = e.detail.value
    for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value === values[j]) {
          checkboxItems[i].checked = true
          break
        }
      }
    }

    this.setData({
      checkboxItems,
      'formData.checkbox': e.detail.value
    })
  },
  bindDateChange(e) {
    let date = new Date();
    let arr = e.detail.value.split("-");
    let pickerDate = new Date(Number(arr[0]), (Number(arr[1]) - 1), Number(arr[2]));
    if (pickerDate > date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.setData({
        birthday: year + "-" + month + "-" + day,
        'formData.birthday': birthday
      })
    } else {
      this.setData({
        birthday: e.detail.value,
        'formData.birthday': e.detail.value
      })
    }
  },
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
    if (`${field}` === 'phone') {
      this.loadData();
    }
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value)

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value)

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value)

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    })
  },
  async submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
        wx.showToast({
          title: errors[firstError[0]].message,
          icon: 'error',
          duration: 2000
        })

      } else {
        // wx.showToast({
        //   title: '校验通过'
        // })
        // 获取标签内容
        // let q = wx.createSelectorQuery();
        // q.select('#input1').fields({
        //   properties: ['value']
        // }, res => {
        //   console.log('query res: ', res);
        // }).exec();


        // 赋值表单被选中的性别
        const radioItems = this.data.radioItems
        for (let i = 0, len = radioItems.length; i < len; ++i) {
          if (radioItems[i].checked) {
            this.setData({
              'formData.sex': radioItems[i].value
            })
          }
        }

        // 如果没有选择的话，将默认的所在地区以及出生日期赋值到表单数据中
        this.setData({
          'formData.region': this.data.region,
          'formData.birthday': this.data.birthday
        })
        this.submitFormData();
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      'formData.region': e.detail.value
    })
  },
  async submitFormData() {

    this.setData({
      'formData.birthday': this.data.birthday,
      'formData.region': this.data.formData.region[2],
      'formData.province': this.data.formData.region[0],
      'formData.city': this.data.formData.region[1],
      'formData.nickname': this.data.formData.nickname,
      'formData.height': this.data.formData.height,
      'formData.height': this.data.formData.height,
      'formData.headimgurl': this.data.avatarUrl
    })
    console.log("json-->" + JSON.stringify(this.data.formData));
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-0gws2yp30d12fdb1"
      },
      "path": "/api/addWxUser",
      "header": {
        "X-WX-SERVICE": "springboot-u4yq",
        'content-type': 'application/json'
      },
      "method": "POST",
      "data": JSON.stringify(this.data.formData)
    });
    if (res.data.code === 0 || res.data.code === '0') {
      wx.setStorageSync('hasUser', true);
      wx.redirectTo({
        url: '../identityuploader/identityuploader?openid=' + res.data.data.openid + "&categories=" + this.data.categories + "&uuid=" + this.data.uuid+"&hasUser=true"
      })
    }
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
        "openid": this.data.formData.openId,
        "phone": this.data.formData.phone
      }
    });
    console.log(res.data.data);
    if (res.data.data != null) {
      this.setData({
        'formData.openId': res.data.data.openId,
        'formData.wxNumber':res.data.data.wxNumber,
        'formData.nickname':res.data.data.nickname,
        'formData.phone':res.data.data.phone,
        'formData.education':res.data.data.education,
        'formData.occupation':res.data.data.occupation,
        'formData.remuneration':res.data.data.remuneration,
        'formData.sex': res.data.data.sex,
        birthday: res.data.data.birthday,
        region: [res.data.data.province,
         res.data.data.city, res.data.data.region],
         'formData.personProfile':res.data.data.personProfile,
         'formData.matingRequirement':res.data.data.matingRequirement,
         'formData.marriageSeekingFlag':res.data.data.marriageSeekingFlag,
         'formData.height':res.data.data.height,
        'formData.weight':res.data.data.weight,
        avatarUrl: res.data.data.headimgurl
     })
    }
   
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  }
})
