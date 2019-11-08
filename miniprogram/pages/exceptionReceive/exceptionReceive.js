// miniprogram/pages/exceptionReceive/exceptionReceive.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    solveDate: '',
    solutionInput: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      id: options.id,
    })
  },

  receiveSubmit: function() {
    var that = this;
    if (that.data.solveDate == '' || that.data.solutionInput == '') {
      wx.showToast({
        icon: 'none',
        title: '不能为空',
      })
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    // 查看状态是否待处理
    db.collection('exception').doc(that.data.id).get({
      success(res) {
        var submitDate = new Date(res.data.submitDate.replace(/-/g, "/"));
        var now = new Date();
        if (submitDate.getFullYear() == now.getFullYear() && submitDate.getMonth() == now.getMonth() && submitDate.getDate() == now.getDate()) {
          var dealDepartReplyOnTime = '是';
        } else {
          var dealDepartReplyOnTime = '否';
        }
        if (res.data.status == '待处理') {
          // 调用云函数修改数据库
          wx.cloud.callFunction({
            name: 'onHandle',
            data: {
              id: that.data.id,
              status: '已接收',
              dealDepartReplyOnTime: dealDepartReplyOnTime,
              expectDealTime: that.data.solveDate,
              reply: that.data.solutionInput,
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '接收成功',
              })
              setTimeout(function(){
                wx.navigateBack({
                  delta: 3,
                })
              }, 1000)
            },
            fail: err => {
              console.error('[云函数] [onHandle] 调用失败', err)
              wx.hideLoading();
              wx.navigateTo({
                url: '../deployFunctions/deployFunctions.wxml',
              })
            }
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '已有人接收该异常',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
      }
    })
    
  },

  bindSolveDateChange: function (e) {
    this.setData({
      solveDate: e.detail.value,
    })
  },

  changeSolutionVal: function(e) {
    this.setData({
      solutionInput: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})