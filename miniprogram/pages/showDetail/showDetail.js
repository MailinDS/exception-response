// miniprogram/pages/showDetail/showDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exceptionContent: {},
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