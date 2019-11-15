// miniprogram/pages/showList/showList.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exceptionList: [],
    page: 1,
    total: 0,

    submitDepartArray: ['全部发起部门', '特高压', '超高压', '总二车间', '总三车间', '母线车间', '表面镀银', '表面油漆', '机加车间', '壳体车间', '绝缘车间', '供应外协', '供应外购', '126产线', '252产线', '西开铸造', '西开有限', '表面精饰', '机构公司', '中低压公司', '西菱公司', '异常监控人员'],
    aIndex: -1,
    dutyDepartArray: ['全部责任部门', '特高压', '超高压', '总二车间', '总三车间', '母线车间', '表面镀银', '表面油漆', '机加车间', '壳体车间', '绝缘车间', '供应外协', '供应外购', '126产线', '252产线', '西开铸造', '西开有限', '表面精饰', '机构公司', '中低压公司', '西菱公司'],
    bIndex: -1,
    statusArray: ['全部处理状态', '待处理', '已接收', '已处理'],
    cIndex: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.getTotal();
    this.getList(1);
  },

  //获取记录总数
  getTotal: function () {
    var that = this
    if (that.data.aIndex == -1 || that.data.aIndex == 0) {
      var submitDepart = '';
    } else {
      var submitDepart = that.data.submitDepartArray[that.data.aIndex];
    }
    if (that.data.bIndex == -1 || that.data.bIndex == 0) {
      var dutyDepart = '';
    } else {
      var dutyDepart = that.data.dutyDepartArray[that.data.bIndex];
    }
    if (that.data.cIndex == -1) {
      var status = '((待处理)|(已接收))';
    } else if (that.data.cIndex == 0) {
      var status = '';
    } else {
      var status = that.data.statusArray[that.data.cIndex];
    }
    db.collection('exception').where(db.command.and([
      {
        department: {
          $regex: '.*' + submitDepart + '.*'
        }
      },
      {
        dutyDepart: {
          $regex: '.*' + dutyDepart + '.*'
        }
      },
      {
        status: {
          $regex: '.*' + status + '.*'
        }
      }
    ])).count({
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
    if (that.data.aIndex == -1 || that.data.aIndex == 0) {
      var submitDepart = '';
    } else {
      var submitDepart = that.data.submitDepartArray[that.data.aIndex];
    }
    if (that.data.bIndex == -1 || that.data.bIndex == 0) {
      var dutyDepart = '';
    } else {
      var dutyDepart = that.data.dutyDepartArray[that.data.bIndex];
    }
    if (that.data.cIndex == -1) {
      var status = '((待处理)|(已接收))';
    } else if (that.data.cIndex == 0) {
      var status = '';
    } else {
      var status = that.data.statusArray[that.data.cIndex];
    }
    db.collection('exception').where(db.command.and([
      {
        department: {
          $regex: '.*' + submitDepart + '.*'
        }
      },
      {
        dutyDepart: {
          $regex: '.*' + dutyDepart + '.*'
        }
      },
      {
        status: {
          $regex: '.*' + status + '.*'
        }
      }
    ])).orderBy('department', 'desc').skip((page - 1) * 20).limit(20).get({
      success(res) {
        // res.data 是包含以上定义的记录的数组
        var listTemp = that.data.exceptionList;
        var resTemp = res.data;
        for (var i = 0; i < resTemp.length; i++) {
          if (resTemp[i].status == "已处理") {
            resTemp[i]['effectDate'] = resTemp[i].effectTime;
          } else {
            var submitDate = new Date(resTemp[i].submitDate.replace(/-/g, "/") + " 00:00:00");
            var now = new Date();
            var effectTimeFloat = (now.getTime() - submitDate.getTime()) / (24 * 60 * 60 * 1000);
            var effectTime = parseInt(effectTimeFloat);
            resTemp[i]['effectDate'] = effectTime;
          }
        }
        that.setData({
          exceptionList: listTemp.concat(resTemp)
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
      url: '../showDetail/showDetail?id=' + e.currentTarget.dataset.exceptionId,
    })
  },

  bindSubmitDepartChange: function(e) {
    this.setData({
      aIndex: e.detail.value
    })
  },

  bindDutyDepartChange: function (e) {
    this.setData({
      bIndex: e.detail.value
    })
  },

  bindStatusChange: function (e) {
    this.setData({
      cIndex: e.detail.value
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