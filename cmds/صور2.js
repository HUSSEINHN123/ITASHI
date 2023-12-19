const google = require('googlethis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function searchImages(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: صور2 [ما تريد أن تبحث عنه]\n\n" +
      "الوصف : يبحث عن الصور بناءً على الاستعلام المحدد باستخدام Google ويرسل ما يصل إلى 6 صور في وقت واحد.\n\n" +
      "مثال : صور2 لوفي";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const query = input.slice(1).join(' ');
  const options = {
    safe: false
  };

  try {
    api.sendMessage(` 🔎 | جاري البحث عن صور ل  "${query}". المرجو الإنتظار...`, event.threadID);

    const response = await google.image(query, options);
    const images = response.slice(0, 6);

    if (images.length > 0) {
      const downloadPromises = images.map((image, index) => {
        const imageUrl = image.url;
        const filePath = path.join(__dirname, '..', 'temp', `${query}_${index}.png`);
        return downloadFile(imageUrl, filePath);
      });

      await Promise.all(downloadPromises);

      const attachments = images.map((image, index) => {
        const filePath = path.join(__dirname, '..', 'temp', `${query}_${index}.png`);
        return fs.createReadStream(filePath);
      });

      api.sendMessage({
        body: ` ✨ | تفضل إليم الصور ل "${query}":`,
        attachment: attachments
      }, event.threadID).catch((err) => {
        console.error(`Error sending message: ${err}`);
      });
    } else {
      api.sendMessage('No images found for the specified query.', event.threadID).catch((err) => {
        console.error(`Error sending message: ${err}`);
      });
    }
  } catch (err) {
    console.error(`Error searching for images: ${err}`);
    api.sendMessage(' ❌ |فشل البحث عن الصور. الرجاء معاودة المحاولة في وقت لاحق.', event.threadID).catch((err) => {
      console.error(`Error sending message: ${err}`);
    });
  }
}

async function downloadFile(url, outputPath) {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

module.exports = searchImages;
