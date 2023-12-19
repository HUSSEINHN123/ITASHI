const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function getArabicDescription(query) {
  try {
    const translationURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`;
    const translationResponse = await axios.get(translationURL);
    const arabicDescription = translationResponse.data[0][0][0];
    return arabicDescription;
  } catch (error) {
    console.error('Error translating description:', error);
    return null;
  }
}

async function getImageByDescription(api, threadID, description) {
  try {
    const arabicDescription = await getArabicDescription(description);
    if (!arabicDescription) {
      throw new Error('Failed to translate description.');
    }

    const imageAPIURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(arabicDescription)}`;
    const imageResponse = await axios.get(imageAPIURL, { responseType: 'stream' });

    // إضافة الجزء لتخزين الصورة محلياً
    const tempImagePath = path.join(__dirname, `../temp/polliimg${arabicDescription.replace(/[^\w\s]/gi, '')}.png`);
    const writeStream = fs.createWriteStream(tempImagePath);
    imageResponse.data.pipe(writeStream);

    writeStream.on('close', () => {
      api.sendMessage({
        body: `✨ إليك صورة تتناسب مع الوصف: ${arabicDescription}`,
        attachment: fs.createReadStream(tempImagePath),
      }, threadID);
    });

    writeStream.on('error', (error) => {
      console.error('Error saving image:', error);
    });
  } catch (error) {
    console.error('Error fetching image by description:', error);
  }
}

module.exports = getImageByDescription;
