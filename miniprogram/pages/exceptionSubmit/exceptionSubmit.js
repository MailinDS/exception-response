// miniprogram/pages/exceptionSubmit/exceptionSubmit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameInput: '陈云',
    departmentInput: '信息化处',
    dateInput: '2019-10-16',
    multiArray: [['AA', 'BB', 'CC'], ['AA01', 'AA02', 'AA03', 'AA04', 'AA05'], ['AA01001', 'AA01002']],
    multiIndex: [-1, -1, -1],
    dwgNoList: [''],
    projectNoInput: '',
    projectNameInput: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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