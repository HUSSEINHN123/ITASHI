// في ملف "الصورة.js"
async function createGrave(api, event, Canvas, request, jimp, fs) {
  try {
    var path_toilet = __dirname + '/../temp/damma.jpg';
    var id = Object.keys(event.mentions)[0] || event.senderID;
    const canvas = Canvas.createCanvas(500, 670);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('https://i.imgur.com/A4quyh3.jpg');

    var avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar = await global.nodemodule['مخططات'].circle(avatar.body);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(avatar), 160, 70, 160, 160);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(path_toilet, imageBuffer);

    api.sendMessage({ attachment: fs.createReadStream(path_toilet, { 'highWaterMark': 128 * 1024 }), body: "اقرو الفاتحة 😂🥂" }, event.threadID, () => fs.unlinkSync(path_toilet), event.messageID);
  } catch (e) {
    api.sendMessage(e.stack, event.threadID);
  }
}

module.exports = createGrave;
      
