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
    wx.hideShareMenu();
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
              db.collection('openRegiste').doc('ef92f8f4-49eb-4d4d-afaa-e4f7c49dcd4d').get({
                success(resp) {
                  if (resp.data.isOpen == 1) {
                    wx.reLaunch({
                      url: '../registe/registe',
                    })
                  } else {
                    wx.showToast({
                      icon: 'none',
                      title: '未开放注册',
                    })
                  }
                }
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
