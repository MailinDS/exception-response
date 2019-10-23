// miniprogram/pages/registe/registe.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputName: '',
    departmentArray: ['机加车间', '壳体车间', '绝缘车间', '表面镀银', '表面油漆', '铸造公司', '有限精饰', '供应处（外协）', '供应处（外购）', '设备能源处'],
    objectDepartmentArray: [
      {
        id: 0,
        name: '机加车间'
      },
      {
        id: 1,
        name: '壳体车间'
      },
      {
        id: 2,
        name: '绝缘车间'
      },
      {
        id: 3,
        name: '表面镀银'
      },
      {
        id: 4,
        name: '表面油漆'
      },
      {
        id: 5,
        name: '铸造公司'
      },
      {
        id: 6,
        name: '有限精饰'
      },
      {
        id: 7,
        name: '供应处（外协）'
      },
      {
        id: 8,
        name: '供应处（外购）'
      },
      {
        id: 9,
        name: '设备能源处'
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
    var that = this;
    db.collection('person').add({
      data: {
        name: that.data.inputName,
        department: that.data.departmentArray[that.data.index]
      },
      success: function() {
        wx.hideLoading();
        app.globalData.name = that.data.inputName;
        app.globalData.department = that.data.departmentArray[that.data.index];
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