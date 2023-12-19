const axios = require('axios');

async function getAnimeClip(api, event) {
  const apiUrl = 'https://jhunapi.mrbaylon4.repl.co/snauzk/?apikey=Marjhunapi';

  try {
    const response = await axios.get(apiUrl);
    const videoUrl = response.data.url;

    api.sendMessage({
      body: 'فيديو أنمي:',
      attachment: videoUrl,
    }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`❌ | حدث خطأ أثناء جلب مقطع الأنمي. الخطأ: ${error.message}`, event.threadID);
  }
}

module.exports = getAnimeClip;
