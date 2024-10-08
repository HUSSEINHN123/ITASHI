const axios = require('axios');
const fs = require('fs');
const request = require('request');
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function shoti(event, api) {
  let bannedGC = [] //["9492786270746965"];
  if (!bannedGC.includes(event.threadID)) {
    const input = event.body.toLowerCase().split(' ');

    if (input.length > 1 && input[1] === '-مساعدة') {
      const usage = 'كيفية الإستخدام: شوتي\n\n' +
        'الوصف : قم بالحصول على مجموعة من فيديوهات لفتيات يرقصن في التيك توك.\n\n' +
        'مثال : شوتي\n\n' +
        'ملاحظة ⚠️: يقوم هذا الأمر لجلب فيديوهات لفتيات يرقصن في التيك توك من واحهة برمجة التطبيقات ويرسلها كرسالة.';
      api.sendMessage(usage, event.threadID);
      return;
    }

    const apiUrl = 'https://api--v1-shoti.vercel.app/api/v1/get';

    try {
      const response = await axios.post(apiUrl, {
        apikey: "shoti-1h72d5ggbqqnk4aj0sg",
      });
      const videoUrl = response.data.data.url;
      await new Promise((resolve, reject) => {
        request(videoUrl)
          .pipe(fs.createWriteStream(`${__dirname}/../temp/shoti.mp4`))
          .on('close', resolve)
          .on('error', reject);
      });

      await delay(1000);

      api.setMessageReaction("✅", event.messageID, (err) => { }, true);
      api.sendMessage({
        body: `@${response.data.data.user.username}`,
        attachment: fs.createReadStream(`${__dirname}/../temp/shoti.mp4`)
      }, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(` ❌ |حدث خطأ أثناء إنشاء الفيديو. خطأ: ${error}`, event.threadID);
    }
  } else {
    api.sendMessage(" ⚠️ | هذا الأمر غير مسموح في هذه المجموعة.", event.threadID, event.messageID);
  }
}
module.exports = shoti;
