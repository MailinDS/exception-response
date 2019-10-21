// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("exception").doc(event.id).update({
      data: {
        dealTime: event.dealTime,
        effectTime: event.effectTime,
        status: '已处理'
      }
    })
  } catch (e) {
    console.error(e)
  }
}