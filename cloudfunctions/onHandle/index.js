// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("exception").doc(event.id).update({
      data: {
        status: event.status,
        dealDepartReplyOnTime: event.dealDepartReplyOnTime,
        expectDealTime: event.expectDealTime,
        reply: event.reply
      }
    })
  } catch (e) {
    console.error(e)
  }
}