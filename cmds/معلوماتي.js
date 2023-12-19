const fs = require('fs');
const request = require('request');

async function stalkCommand(event, api) {
  try {
    var uid = Object.keys(event.mentions)[0];
    if (Object.keys(event.mentions) == 0) {
      api.sendMessage(` ⚠️ | قم بعمل منشن للشخص ما.`, event.threadID, event.messageID);
      return;
    }

    let data = await api.getUserInfo(parseInt(uid));
    var picture = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    var file = fs.createWriteStream(__dirname + "/../temp/stalk.png");
    var rqs = request(encodeURI(`${picture}`));
    rqs.pipe(file);

    file.on('finish', function () {
      var name = data[uid].name;
      var username = data[uid].vanity;
      var herGender = data[uid].gender;
      var type = data[uid].type;
      var url = data[uid].profileUrl;
      var firstName = data[uid].firstName;
      let gender = "";
      switch (herGender) {
        case 1:
          gender = "أنثى";
          break;
        case 2:
          gender = "ذكر";
          break;
        default:
          gender = "Custom";
      }

      api.sendMessage({
        body: ` ✨ مــﻋــڷــﯡمــاٺ ؏ــن ${firstName}\n\n اﻻڛــم : ${name}\n إڛــم اڷــمــڛــٿــڅــدم : ${username}\nاڶــڃــڼــڛ : ${gender}\nاڵــڼــﯡ؏: ${type}\nڕابــٹ اڸــبــڔﯡڣــٱڀــڸ : ${url}\n ٱڀــدي: ${uid}`,
        attachment: fs.createReadStream(__dirname + '/../temp/stalk.png')
      }, event.threadID, event.messageID);
    });
  } catch (err) {
    console.error('Error:', err);
    api.sendMessage(' ❌ |حدث خطأ أثناء المطاردة. الرجاء معاودة المحاولة في وقت لاحق.', event.threadID, event.messageID);
  }
}

module.exports = stalkCommand;
