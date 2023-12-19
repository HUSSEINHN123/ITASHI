const axios = require('axios');
const fs = require('fs');
const request = require('request');
const path = require('path');

async function lyrics(event, api) {
  const input = event.body.toLowerCase().trim();
  if (input.includes("-مساعدة")) {
    const usage = "كيفية الإستخدام: كلمات [إسم الأغنية]\n\n" +
      "الوصف : يقوم بإرسال كلمات الأغنية ويرسلها مع صورة الأغنية.\n\n" +
      "مثال: كلمات fifty fifty copied";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const title = input.slice(7);

  axios
    .get(`https://sampleapi-mraikero-01.vercel.app/get/lyrics?title=${title}`)
    .then(response => {

      const result = response.data.result;
      const message = `عنوان الأغنية 📀 "${result.s_title}" من طرف 🧾${result.s_artist}:\n\n${result.s_lyrics}`;
      const imagePath = path.join(__dirname, '../temp/lyrics.jpg');

      request(result.s_image).pipe(fs.createWriteStream(imagePath)).on('finish', () => {
        api.sendMessage({
          body: message,
          attachment: fs.createReadStream(imagePath)
        }, event.threadID);
      });
    })
    .catch(error => {
      console.error(error);
      api.sendMessage(" ❌ |حدث خطأ أثناء جلب الكلمات والصورة. الرجاء معاودة المحاولة في وقت لاحق.", event.threadID);
    });
}

module.exports = lyrics;
