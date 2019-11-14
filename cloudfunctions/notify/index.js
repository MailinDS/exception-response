const cloud = require('wx-server-sdk')
const axios = require('axios')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
// 调用企业微信接口
exports.main = async (event, context) => {
  console.log(event)
  try {
    const resultValue = await rp('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wxe825e943b87165a0&corpsecret=x95nvV3HfOWrrFC2zkxqzxS3GolPahfWAqclRL1Dbls')
    const token = JSON.parse(resultValue).access_token;
    console.log('------ TOKEN:', token);

    var department = event.department;
    var name = event.name;

    console.log('------ NAME:', name);

    const response = await axios({
      method: 'post',
      url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=' + token,
      responseType: 'json',
      data: {
        "touser": "CHENYUN",
        "msgtype": 'text',
        "agentid": 1000005,
        "text": { 'content': department + "的" + name + "提交了新的异常" },
        "safe": 0
      },
    });

    console.log(response)
    return "OK"

    // return await cloud.uploadFile({
    //   cloudPath: 'xcxcodeimages/' + Date.now() + '.png',
    //   fileContent: response.data,
    // });
  } catch (err) {
    console.log('>>>>>> ERROR:', err)
    return "ERROR"
  }
}