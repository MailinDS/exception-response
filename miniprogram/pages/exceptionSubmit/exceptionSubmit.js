// miniprogram/pages/exceptionSubmit/exceptionSubmit.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameInput: '',
    departmentInput: '',
    dateInput: '',
    multiArray: [['AA', 'BB', 'CC'], ['AA01', 'AA02', 'AA03', 'AA04', 'AA05'], ['AA01001', 'AA01002']],
    multiIndex: [-1, -1, -1],
    dwgNoList: [''],
    projectNoInput: '',
    projectNameInput: '',
    dutyDepartArray: ['部门A', '部门B', '部门C', '部门D', '部门E'],
    bIndex: -1,
    dealDepartArray: ['部门A', '部门B', '部门C', '部门D', '部门E'],
    cIndex: -1,
    explainInput: '',
    fileIDList: [],
    uploadButton: '上传图片',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = new Date();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (date < 10) {
      date = '0' + date;
    }
    var today = now.getFullYear() + '-' + month + '-' + date;
    this.setData({
      nameInput: app.globalData.name,
      departmentInput: app.globalData.department,
      dateInput: today,
    })
  },

  doSubmit: function() {
    // 姓名，部门，日期不能为空
    if (this.data.nameInput == '' || this.data.departmentInput == '' || this.data.dateInput == '') {
      wx.showToast({
        icon: 'none',
        title: '未知错误',
      })
      return false;
    }

    // 必填项不能为空
    if (this.data.multiIndex[0] == -1 || this.data.multiIndex[1] == -1 || this.data.multiIndex[2] == -1 || this.data.projectNoInput == '' || this.data.projectNameInput == '' || this.data.bIndex == -1 || this.data.cIndex == -1 || this.data.explainInput == '') {
      wx.showToast({
        icon: 'none',
        title: '必填项不能为空',
      })
      return false;
    }
    for (var i = 0; i < this.data.dwgNoList.length; i++) {
      if (this.data.dwgNoList[i] == '') {
        wx.showToast({
          icon: 'none',
          title: '必填项不能为空',
        })
        return false;
      }
    }
    wx.showLoading({
      title: '提交中',
    })
    // 保存至数据库
    var that = this;
    db.collection('exception').add({
      data: {
        name: that.data.nameInput,
        department: that.data.departmentInput,
        submitDate: that.data.dateInput,
        exceptionLV1: that.data.multiArray[0][that.data.multiIndex[0]],
        exceptionLV2: that.data.multiArray[1][that.data.multiIndex[1]],
        exceptionLV3: that.data.multiArray[2][that.data.multiIndex[2]],
        dwgNoList: that.data.dwgNoList,
        projectNo: that.data.projectNoInput,
        projectName: that.data.projectNameInput,
        exceptionExplain: that.data.explainInput,
        dutyDepart: that.data.dutyDepartArray[that.data.bIndex],
        dutyDepartReplyOnTime: '',
        dealDepart: that.data.dealDepartArray[that.data.cIndex],
        dealDepartReplyOnTime: '',
        reply: '',
        expectDealTime: '',
        dealTime: '',
        effectTime: '',
        fileIDList: that.data.fileIDList,
        status: '待处理',
      },
      success: function() {
        wx.showToast({
          title: '提交成功',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '系统繁忙',
        })
      }
    })
  },

  doUpload: function () {

    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        that.setData({
          uploadButton: '继续上传'
        })

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 设置在云存储存储图片的目录
        var d = new Date()
        var document = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()

        // 上传图片
        // 创建的目录名加图片名(当前时间戳)加上传图片的后缀
        const cloudPath = document + '/' + app.globalData.openid.substring(25) + new Date().getTime() + filePath.match(/\.[^.]+$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            console.log(filePath)

            // 将小图片fileID存入list中
            that.data.fileIDList.push(res.fileID)
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
            })

          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  changeDwgVal: function(e) {
    var dwgNoList = this.data.dwgNoList;
    dwgNoList[e.currentTarget.dataset.id] = e.detail.value;
    this.setData({
      dwgNoList: dwgNoList,
    })
  },

  dwgCut: function(e) {
    var dwgNoList = this.data.dwgNoList;
    dwgNoList.splice(e.currentTarget.dataset.id,1);
    this.setData({
      dwgNoList: dwgNoList,
    })
  },

  dwgAdd: function(e) {
    var dwgNoList = this.data.dwgNoList;
    dwgNoList.push('');
    this.setData({
      dwgNoList: dwgNoList,
    })
  },

  changeProjectNoVal: function(e) {
    this.setData({
      projectNoInput: e.detail.value
    })
  },

  changeProjectNameVal: function (e) {
    this.setData({
      projectNameInput: e.detail.value
    })
  },

  bindDutyDepartChange: function(e) {
    this.setData({
      bIndex: e.detail.value
    })
  },

  bindDealDepartChange: function(e) {
    this.setData({
      cIndex: e.detail.value
    })
  },

  changeExplainVal: function(e) {
    this.setData({
      explainInput: e.detail.value
    })
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },

  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['AA01', 'AA02', 'AA03', 'AA04', 'AA05'];
            data.multiArray[2] = ['AA01001', 'AA01002'];
            break;
          case 1:
            data.multiArray[1] = ['BB01', 'BB02', 'BB03'];
            data.multiArray[2] = ['BB01001', 'BB01002', 'BB01003'];
            break;
          case 2:
            data.multiArray[1] = ['CC01', 'CC02'];
            data.multiArray[2] = ['CC01001'];
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['AA01001', 'AA01002'];
                break;
              case 1:
                data.multiArray[2] = ['AA02001'];
                break;
              case 2:
                data.multiArray[2] = ['AA03001', 'AA03002'];
                break;
              case 3:
                data.multiArray[2] = ['AA04001', 'AA04002', 'AA04003'];
                break;
              case 4:
                data.multiArray[2] = ['AA05001', 'AA05002', 'AA05003', 'AA05004'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['BB01001', 'BB01002', 'BB01003'];
                break;
              case 1:
                data.multiArray[2] = ['BB02001', 'BB02002'];
                break;
              case 2:
                data.multiArray[2] = ['BB03001', 'BB03002', 'BB03003'];
                break;
            }
            break;
          case 2:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['CC01001'];
                break;
              case 1:
                data.multiArray[2] = ['CC02001', 'CC02002'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
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