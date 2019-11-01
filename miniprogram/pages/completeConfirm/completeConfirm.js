// miniprogram/pages/completeConfirm/completeConfirm.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exceptionContent: {},
    completeBtnVisible: false,
    imgUrlList: [],
    imgNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('exception').doc(options.id).get({
      success(res) {
        that.setData({
          exceptionContent: res.data,
        })
        // 如果状态是已接收，异常发起人能看到完成异常button
        if (that.data.exceptionContent.status == '已接收' && that.data.exceptionContent.name == app.globalData.name) {
          that.setData({
            completeBtnVisible: true,
          })
        }
        // 用图片fileID换取图片临时链接
        wx.cloud.getTempFileURL({
          fileList: that.data.exceptionContent.fileIDList,
          success: res => {
            var imgUrlTemp = [];
            for (var i = 0; i < res.fileList.length; i++) {
              imgUrlTemp.push(res.fileList[i].tempFileURL)
            }
            that.setData({
              imgUrlList: imgUrlTemp,
              imgNum: imgUrlTemp.length,
            })
          },
          fail: console.error
        })
      }
    })
  },

  // 完成异常
  exceptionComplete: function() {
    wx.showLoading({
      title: '处理中',
    })
    var that = this
    var now = new Date();
    var submitDate = new Date(this.data.exceptionContent.submitDate.replace(/-/g, "/") + " 00:00:00");
    var effectTimeFloat = (now.getTime() - submitDate.getTime()) / (24 * 60 * 60 * 1000);
    if (effectTimeFloat < 1) {
      var effectTime = 0;
    } else {
      var effectTime = parseInt(effectTimeFloat);
    }
    var dealMonth = now.getMonth() + 1;
    if (dealMonth < 10) {
      dealMonth = '0' + dealMonth;
    }
    var dealDate = now.getDate();
    if (dealDate < 10) {
      dealDate = '0' + dealDate;
    }
    var dealTime = now.getFullYear() + '-' + dealMonth + '-' + dealDate;
    wx.cloud.callFunction({
      name: 'onComplete',
      data: {
        id: that.data.exceptionContent._id,
        dealTime: dealTime,
        effectTime: effectTime
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '处理成功',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 2,
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
  },

  // 图片预览
  imgViewTap: function (e) {
    var i = Number(e.currentTarget.dataset.imgNo)
    wx.previewImage({
      urls: this.data.imgUrlList,
      current: this.data.imgUrlList[i]
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