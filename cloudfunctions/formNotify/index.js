const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var openId = event.openId;
  var submitDate = event.submitDate;
  var dutyDepart = event.dutyDepart;
  var reply = event.reply;
  var formId = event.formId;
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: openId,
      data: {
        keyword1: {
          value: submitDate
        },
        keyword2: {
          value: dutyDepart
        },
        keyword3: {
          value: reply
        }
      },
      templateId: 'TEMPLATE_ID',
      formId: formId,
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}