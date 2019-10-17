//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    })
    
    this.onGetOpenid();

  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        var that = this
        db.collection('person').where({
          _openid: app.globalData.openid
        }).get({
          success(re) {
            console.log(re.data);
            if (re.data.length == 0) {
              wx.reLaunch({
                url: '../registe/registe',
              })
            } else {
              app.globalData.name = re.data[0].name;
              app.globalData.department = re.data[0].department;
              wx.reLaunch({
                url: '../mainPage/mainPage',
              })
            }
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }

})
