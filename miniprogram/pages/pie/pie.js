// miniprogram/pages/pie/pie.js

import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const db = wx.cloud.database();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  wx.showLoading({
    title: '加载中',
  })
  // 定义是或否按时接收的数量
  var yesNum = 0;
  var noNum = 0;
  db.collection('exception').where({
    dealDepartReplyOnTime: '是'
  }).count({
    success: function (res) {
      yesNum = res.total;
      db.collection('exception').where({
        dealDepartReplyOnTime: '否'
      }).count({
        success: function (res) {
          noNum = res.total;
          wx.hideLoading();

          var option = {
            backgroundColor: "#ffffff",
            color: ["#37A2DA", "#FF9F7F"],
            series: [{
              label: {
                normal: {
                  fontSize: 14
                }
              },
              type: 'pie',
              center: ['50%', '50%'],
              radius: [0, '60%'],
              data: [{
                value: yesNum,
                name: '是'
              }, {
                value: noNum,
                name: '否'
              },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 2, 2, 0.3)'
                }
              }
            }]
          };

          chart.setOption(option);
          return chart;


        }
      })
    }
  })
  


  
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  echartInit(e) {
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  }
})