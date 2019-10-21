// miniprogram/pages/confirmList/confirmList.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput: '',
    exceptionList: [],
    page: 1,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTotal();
    this.getList(1);
  },

  //获取记录总数
  getTotal: function () {
    var that = this
    db.collection('exception').where({
      department: app.globalData.department
    }).count({
      success(res) {
        that.setData({
          total: res.total
        })
      }
    })
  },

  // 按页分批获取记录
  getList: function (page) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    db.collection('exception').where({
      department: app.globalData.department
    }).where(db.command.or([
      {
        name: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        department: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        status: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        exceptionLV1: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        exceptionLV2: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        exceptionLV3: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        projectNo: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        projectName: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      },
      {
        submitDate: {
          $regex: '.*' + that.data.searchInput + '.*'
        }
      }
    ])).orderBy('submitDate', 'desc').skip((page - 1) * 20).limit(20).get({
      success(res) {
        // res.data 是包含以上定义的记录的数组
        var listTemp = that.data.exceptionList
        that.setData({
          exceptionList: listTemp.concat(res.data)
        })
        // console.log(that.data.problemList)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  // 显示异常详情
  showDetail: function (e) {
    wx.navigateTo({
      url: '../completeConfirm/completeConfirm?id=' + e.currentTarget.dataset.exceptionId,
    })
  },

  changeSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },

  // 执行搜索
  search: function () {
    this.setData({
      exceptionList: [],
      page: 1,
    });
    this.onLoad();
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
    if (parseInt((this.data.total - 1) / 20 + 1) > this.data.page) {
      this.setData({
        page: this.data.page + 1
      })
      this.getList(this.data.page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})