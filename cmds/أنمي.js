const fs = require('fs');
const https = require('https');
const {
  Configuration,
  OpenAIApi
} = require("openai");
const path = require('path');
const apiKeysPath = path.join(__dirname, '..', 'json', 'api_config.json');
const apiKeys = JSON.parse(fs.readFileSync(apiKeysPath));
const openaiApiKey = apiKeys.openai;

async function randomAnime(event, api) {
  // لا يتوقع أي مدخل، لذلك نقوم بتجاهله
  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    api.sendMessage(" ⏱️ | جاري إرسال صور الأنمي ،يرجى الإنتظار.", event.threadID, event.messageID);

    // استخدم الAPI الجديدة للحصول على صورة أنمي عشوائية
    const apiUrl = "https://anime.grykj.repl.co";
    const response = await openai.createImage({
      prompt: apiUrl,
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data.data[0].url;
    const imagePath = path.join(__dirname, '../temp/random_anime.jpg');

    https.get(image_url, (linkResponse) => {
      const fileStream = fs.createWriteStream(imagePath);
      linkResponse.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log("Anime image saved!");
        var message = {
          body: " ✨ | إليك صور الأنمي اللتي طلبت:",
          attachment: fs.createReadStream(imagePath)
        };
        api.sendMessage(message, event.threadID, event.messageID);
      });
    });
  } catch (error) {
    console.log(error);
    api.sendMessage(" ❌ | حدث خطأ أثناء جلب البيانات من واجهة برمجة التطبيقات حاول مجددا لاحقا.", event.threadID, event.messageID);
  }
}

module.exports = randomAnime;
