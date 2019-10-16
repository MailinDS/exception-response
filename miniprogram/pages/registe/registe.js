// miniprogram/pages/registe/registe.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputName: '',
    departmentArray: ['部门A', '部门B', '部门C', '部门D', '部门E'],
    objectDepartmentArray: [
      {
        id: 0,
        name: '部门A'
      },
      {
        id: 1,
        name: '部门B'
      },
      {
        id: 2,
        name: '部门C'
      },
      {
        id: 3,
        name: '部门D'
      },
      {
        id: 4,
        name: '部门E'
      }
    ],
    index: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  registe: function() {
    wx.showLoading({
      title: '注册中',
    })
    if (this.data.inputName == '' || this.data.index == -1) {
      wx.showToast({
        icon: 'none',
        title: '姓名和部门都是必填项',
      })
      return false;
    }
    // var that = this;
    db.collection('person').add({
      data: {
        name: this.data.inputName,
        department: this.data.departmentArray[this.data.index]
      },
      success: function() {
        wx.hideLoading();
        wx.showToast({
          title: '注册成功',
        })
        setTimeout(function () {
          wx.reLaunch({
            url: '../mainPage/mainPage',
          })
        }, 1000)
        
      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '注册失败',
        })
      }
    })
  },

  changeNameVal: function(e) {
    this.setData({
      inputName: e.detail.value
    })
  },

  bindDepartmentChange: function(e) {
    this.setData({
      index: e.detail.value
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