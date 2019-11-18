const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var openId = event.openId;
  var submitDate = event.submitDate;
  var dutyDepart = event.dutyDepart;
  var dutyPerson = event.dutyPerson;
  var expectDealTime = event.expectDealTime;
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
          value: dutyPerson
        },
        keyword4: {
          value: expectDealTime
        }
      },
      templateId: 'OFTheF-ptLIxGEvmaEMBsFEfkuUdKAzSH1SVGrgHjro',
      formId: formId,
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}