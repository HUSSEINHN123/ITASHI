const google = require('googlethis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function تعريف_الكلمة(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = "الاستخدام: تعريف_الكلمة [الكلمة]\n\n" +
      "الوصف: يسترجع تعريف الكلمة المحددة باستخدام قاموس Google.\n\n" +
      "مثال: تعريف_الكلمة رائع";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const word = input[1];
  const options = {
    additional_params: {
      hl: 'ar'
    }
  };

  try {
    const query = `تعريف ${word}`;
    const response = await google.search(query, options);
    const dictionary = response.dictionary;

    if (dictionary) {
      let message = '';

      message += `الكلمة: ${dictionary.word}\n`;
      message += `النطق: ${dictionary.phonetic}\n\n`;

      dictionary.definitions.forEach((definition, index) => {
        message += `التعريف ${index + 1}: ${definition}\n`;
      });

      message += '\nالأمثلة:\n';
      dictionary.examples.forEach((example, index) => {
        message += `المثال ${index + 1}: ${example}\n`;
      });

      const audioUrl = dictionary.audio;
      if (audioUrl) {
        const audioPath = path.join(__dirname, '..', 'temp', `${word}.mp3`);
        await تنزيل_الملف(audioUrl, audioPath);
        const audioAttachment = fs.createReadStream(audioPath);
        api.sendMessage({
          body: message,
          attachment: audioAttachment
        }, event.threadID);
      } else {
        api.sendMessage(message, event.threadID);
      }
    } else {
      api.sendMessage(' ⚠️ |لم يتم العثور على تعريف للكلمة المحددة.', event.threadID);
    }
  } catch (err) {
    console.error(`حدث خطأ أثناء استرجاع تعريف الكلمة: ${err}`);
    api.sendMessage(' ❌ |فشل في استرجاع تعريف الكلمة. يرجى المحاولة مرة أخرى لاحقًا.', event.threadID);
  }
}

async function تنزيل_الملف(url, outputPath) {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

module.exports = تعريف_الكلمة;
