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
    multiArray: [['质量', '设计', '缺件', '设备', '计划'], ['断路器', '隔离开关', '接地开关', 'PT/CT/LA', '母线/分支/内导', '备品备件', '机构', '绝缘件', '底架/支架/附件', 'LCP柜'], ['壳体外观五害油漆', '导体类镀银质量', '加工尺寸不符', '机构问题', '其它']],
    multiIndex: [-1, -1, -1],
    dwgNoList: [''],
    projectNoInput: '',
    projectNameInput: '',
    dutyArray: [['特高压', '超高压', '总二车间', '总三车间', '母线车间', '表面镀银', '表面油漆', '机加车间', '壳体车间', '绝缘车间', '供应外协', '供应外购', '126产线', '252产线', '西开铸造', '西开有限', '表面精饰', '机构公司', '中低压公司', '西菱公司'], ['杨江涛']],
    dutyIndex: [-1, -1],
    dealDepartArray: ['特高压', '超高压', '总二车间', '总三车间', '母线车间', '表面镀银', '表面油漆', '机加车间', '壳体车间', '绝缘车间', '供应外协', '供应外购', '126产线', '252产线', '西开铸造', '西开有限', '表面精饰', '机构公司', '中低压公司', '西菱公司'],
    cIndex: -1,
    explainInput: '',
    fileIDList: [],
    uploadButton: '上传图片',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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

  doSubmit: function(e) {
    // 姓名，部门，日期不能为空
    if (this.data.nameInput == '' || this.data.departmentInput == '' || this.data.dateInput == '') {
      wx.showToast({
        icon: 'none',
        title: '未知错误',
      })
      return false;
    }

    // 必填项不能为空
    if (this.data.multiIndex[0] == -1 || this.data.multiIndex[1] == -1 || this.data.multiIndex[2] == -1 || this.data.projectNoInput == '' || this.data.projectNameInput == '' || this.data.dutyIndex[0] == -1 || this.data.dutyIndex[1] == -1 || this.data.cIndex == -1 || this.data.explainInput == '') {
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
        dutyDepart: that.data.dutyArray[0][that.data.dutyIndex[0]],
        dutyPerson: that.data.dutyArray[1][that.data.dutyIndex[1]],
        dutyDepartReplyOnTime: '',
        dealDepart: that.data.dealDepartArray[that.data.cIndex],
        dealDepartReplyOnTime: '',
        reply: '',
        expectDealTime: '',
        dealTime: '',
        effectTime: '',
        fileIDList: that.data.fileIDList,
        status: '待处理',
        formId: e.detail.formId,
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

  // bindDutyDepartChange: function(e) {
  //   this.setData({
  //     bIndex: e.detail.value
  //   })
  // },

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

  bindDutyChange: function(e) {
    this.setData({
      dutyIndex: e.detail.value
    })
  },

  bindDutyColumnChange: function(e) {
    var data = {
      dutyArray: this.data.dutyArray,
      dutyIndex: this.data.dutyIndex
    };
    data.dutyIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      switch (data.dutyIndex[0]) {
        case 0:
          data.dutyArray[1] = ['杨江涛'];
          break;
        case 1:
          data.dutyArray[1] = ['闫练'];
          break;
        case 2:
          data.dutyArray[1] = ['时龙斌'];
          break;
        case 3:
          data.dutyArray[1] = ['吴亚旭'];
          break;
        case 4:
          data.dutyArray[1] = ['李韬'];
          break;
        case 5:
          data.dutyArray[1] = ['张香', '张敏', '樊梅花', '刘伟刚'];
          break;
        case 6:
          data.dutyArray[1] = ['王薇', '李军', '李伟', '刘鑫涛'];
          break;
        case 7:
          data.dutyArray[1] = ['王云', '丁瑞'];
          break;
        case 8:
          data.dutyArray[1] = ['卢德军', '段春龙'];
          break;
        case 9:
          data.dutyArray[1] = ['丁嘉宝', '王婵', '池西鹏'];
          break;
        case 10:
          data.dutyArray[1] = ['周高平', '任强', '高博强', '高升'];
          break;
        case 11:
          data.dutyArray[1] = ['杨静', '李婉妮', '徐吉豹', '石妮'];
          break;
        case 12:
          data.dutyArray[1] = ['杨秦星', '冯继亮', '王震', '于庄鑫'];
          break;
        case 13:
          data.dutyArray[1] = ['杨秦星', '冯继亮', '王震', '于庄鑫'];
          break;
        case 14:
          data.dutyArray[1] = ['杨光普'];
          break;
        case 15:
          data.dutyArray[1] = ['姚宏轩(CT)', '杨波涛(CT)', '孙小民(HJ)', '李美峰(JG)'];
          break;
        case 16:
          data.dutyArray[1] = ['林江波'];
          break;
        case 17:
          data.dutyArray[1] = ['崔海斌'];
          break;
        case 18:
          data.dutyArray[1] = ['黄磊'];
          break;
        case 19:
          data.dutyArray[1] = ['赵军'];
          break;
      }
      data.dutyIndex[1] = 0;
    }
    this.setData(data);
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
            data.multiArray[1] = ['断路器', '隔离开关', '接地开关', 'PT/CT/LA', '母线/分支/内导', '备品备件', '机构', '绝缘件', '底架/支架/附件', 'LCP柜'];
            data.multiArray[2] = ['壳体外观五害油漆', '导体类镀银质量', '加工尺寸不符', '机构问题', '其它'];
            break;
          case 1:
            data.multiArray[1] = ['断路器', '隔离开关', '接地开关', 'PT/CT/LA', '母线/分支/内导', '总装', '备品备件', '机构', 'LCP柜'];
            data.multiArray[2] = ['错漏投', '其它'];
            break;
          case 2:
            data.multiArray[1] = ['断路器', '隔离开关', '接地开关', '总装', 'LCP柜'];
            data.multiArray[2] = ['导体', '绝缘件', '外壳', '机构', '其它'];
            break;
          case 3:
            data.multiArray[1] = ['设备'];
            data.multiArray[2] = ['设备', '其它'];
            break;
          case 4:
            data.multiArray[1] = ['上下工序'];
            data.multiArray[2] = ['未按规则收料', '未按时办理手续', '未按规则发料', '未按时发拉动需求', '其它'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['壳体外观五害油漆', '导体类镀银质量', '加工尺寸不符', '机构问题', '其它'];
                break;
              case 1:
                data.multiArray[2] = ['壳体外观五害油漆', '导体类镀银质量', '其它'];
                break;
              case 2:
                data.multiArray[2] = ['壳体外观五害油漆', '导体类镀银质量', '其它'];
                break;
              case 3:
                data.multiArray[2] = ['壳体外观五害油漆', '内部清理问题', '外壳漏气', '其它'];
                break;
              case 4:
                data.multiArray[2] = ['壳体外观五害油漆', '导体磕碰划伤', '外壳面清理质量', '导体类外表面质量', '铸造导体砂眼', '导体类镀银质量', '其它'];
                break;
              case 5:
                data.multiArray[2] = ['壳体外观五害油漆', '其它'];
                break;
              case 6:
                data.multiArray[2] = ['外观质量', '调试问题', '其它'];
                break;
              case 7:
                data.multiArray[2] = ['磕碰.划伤', '放电击穿清理问题', '杂质.异物', '其它'];
                break;
              case 8:
                data.multiArray[2] = ['表面质量', '孔位错误', '加工尺寸不符', '其它'];
                break;
              case 9:
                data.multiArray[2] = ['柜内缺件', '规格错漏', '接线错误', '其它'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
              case 1:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
              case 2:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
              case 3:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
              case 4:
                data.multiArray[2] = ['错漏投', '电阻错.无正式版', '图纸.JT错误', '其它'];
                break;
              case 5:
                data.multiArray[2] = ['错漏投', '电阻错.无正式版', '图纸.JT错误', '其它'];
                break;
              case 6:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
              case 7:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
              case 8:
                data.multiArray[2] = ['错漏投', '其它'];
                break;
            }
            break;
          case 2:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['导体', '绝缘件', '外壳', '机构', '其它'];
                break;
              case 1:
                data.multiArray[2] = ['导体', '绝缘件', '外壳', '机构', '其它'];
                break;
              case 2:
                data.multiArray[2] = ['导体', '绝缘件', '外壳', '机构', '其它'];
                break;
              case 3:
                data.multiArray[2] = ['绝缘件', '波纹管', '避雷器', '底架.支架', '盖板.法兰', '导体', '外壳', '备品备件', '其它'];
                break;
              case 4:
                data.multiArray[2] = ['智能化处二次元件', '二次元件', '铭牌', '其它'];
                break;
            }
            break;
          case 3:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['设备', '其它'];
                break;
            }
            break;
          case 4:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['未按规则收料', '未按时办理手续', '未按规则发料', '未按时发拉动需求', '其它'];
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