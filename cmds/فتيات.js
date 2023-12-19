const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function sendRandomImage(api, threadID) {
  const images = [
    "https://i.imgur.com/MMcBfhQ.jpg",
    "https://i.imgur.com/bFDiwev.jpg",
    "https://i.imgur.com/SAOdnoK.jpg",
    "https://i.imgur.com/TZ1RHnm.jpg",
    "https://i.imgur.com/Ar8wDeL.jpg",
    "https://i.imgur.com/edI973K.jpg",
    "https://i.imgur.com/KeC6WlN.jpg",
    "https://i.imgur.com/pZ1RYOa.jpg",
    "https://i.imgur.com/Izft7RA.jpg",
    "https://i.imgur.com/jM1Xpga.jpg",
    "https://i.imgur.com/NTXJLbO.jpg",
    "https://i.imgur.com/txJ9OsI.jpg",
    "https://i.imgur.com/xBDRQj7.jpg",
    "https://i.imgur.com/rfP4uLF.jpg",
    "https://i.imgur.com/Srwy9OH.jpg",
    "https://i.imgur.com/FjfTktc.jpg",
    "https://i.imgur.com/54ZTqat.jpg",
    "https://i.imgur.com/giWZT5C.jpg",
    "https://i.imgur.com/9rvJ3NM.jpg",
    "https://i.imgur.com/tCAVuec.jpg",
    "https://i.imgur.com/6wd5DHO.jpg",
    "https://i.imgur.com/7gK5Tf4.jpg",
    "https://i.imgur.com/KvZrcw8.jpg",
    "https://i.imgur.com/0B2akj2.jpg",
    "https://i.imgur.com/MsPM3qs.jpg",
    "https://i.imgur.com/cANGlUv.jpg",
    "https://i.imgur.com/I0RUsfD.jpg",
    "https://i.imgur.com/MF6y3P1.jpg",
    "https://i.imgur.com/aeyKs27.jpg",
    "https://i.imgur.com/W4II2pG.jpg",
    "https://i.imgur.com/txL8OWM.jpg",
    "https://i.imgur.com/MIJ9FWu.jpg",
    "https://i.imgur.com/BXgOzif.jpg",
    "https://i.imgur.com/UOsW7qy.jpg",
    "https://i.imgur.com/oyhAzRg.jpg",
    "https://i.imgur.com/CykGuoX.jpg",
    "https://i.imgur.com/aVIuJ4x.jpg",
    "https://i.imgur.com/l4mWqE2.jpg",
    "https://i.imgur.com/39HVTF3.jpg",
    "https://i.imgur.com/R3T4Rq7.jpg",
    "https://i.imgur.com/bxId8wI.jpg",
    "https://i.imgur.com/scxppXG.jpg",
    "https://i.imgur.com/lDnPGOH.jpg",
    "https://i.imgur.com/NRWxB4I.jpg",
    "https://i.imgur.com/TdOhT1B.jpg"
    // ... (الصور الخاصة بك)
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  const randomImage = images[randomIndex];

  api.sendMessage({ body: `✨تفضل ها هي صورة عشوائية لك: ${randomImage}`, mentions: [{ tag: '', id: threadID }] }, threadID);

  // هنا يتم إضافة الجزء لتنزيل الصورة
  const response = await axios.get(randomImage, { responseType: 'stream' });
  await new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(`${__dirname}/../temp/girls.jpg`))
      .on('close', resolve)
      .on('error', reject);
  });

  // Add this line to react to the message with "✅"
  api.setMessageReaction("😏", event.messageID, (err) => { }, true);

  return randomImage;
}

module.exports.handleEvent = function({ api, event }) {
  const { body, senderID, threadID } = event;

  // إزالة هذا الجزء
  // if (body === '💖') {
  sendRandomImage(api, threadID);
  // }
};

module.exports.run = function({ api, event }) {
  sendRandomImage(api, event.threadID);
};
