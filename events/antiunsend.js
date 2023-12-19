const fs = require("fs");
const path = require('path');
const https = require("https");

const configPath = path.join(__dirname, '..', 'json', 'config.json');
const config = require(configPath);

let messagesData = {}; 

function clearMessagesData() {
  messagesData = {}; 
  fs.writeFileSync(path.join(__dirname, '..', 'json', 'messagesData.json'), JSON.stringify(messagesData, null, 2));
}

clearMessagesData();
setInterval(clearMessagesData, 30 * 60 * 1000); 

async function handleUnsend(api, event) {
  async function sendToAdmins(message) {
    for (const adminsUid of config.admins) {
      try {
        await api.sendMessage(message, adminsUid);
      } catch (err) {
        console.error("Failed to send message to admin " + adminsUid + ": " + err);
      }
    }
  }

  async function text_reply() {
    try {
      const userInfo = await api.getUserInfo(event.senderID);

      const message = {
        body: 'مستخدم.: @' + userInfo[event.senderID].name + ' \n\nتمت محاولة حذف هذه الرسالة.\n\n' + messagesData[event.messageID].body,
        mentions: [{
          tag: '@' + userInfo[event.senderID].name,
          id: event.senderID,
          fromIndex: 0,
        }]
      };

      api.sendMessage(message, event.threadID);

      sendToAdmins(message);
    } catch (err) {
      api.sendMessage("Text_reply error: " + err, event.threadID);
    }
  }

  async function photo_reply() {
    try {
      const imagesList = [];
      const imagesUrl = messagesData[event.messageID].attachments.map(imagesLinks => imagesLinks.url);

      for (let i = 0; i < imagesUrl.length; i++) {
        const fileName = path.join(__dirname, '../temp/', 'image_' + i + '.jpg');
        await new Promise((resolve, reject) => {
          https.get(imagesUrl[i], (response) => {
            const fileStream = fs.createWriteStream(fileName);
            response.pipe(fileStream);
            response.on('end', () => {
              console.log('تم تنزيل الصورة بنجاح...');
              imagesList.push(fs.createReadStream(fileName));
              resolve();
            });
            response.on('error', (err) => {
              reject(err);
            });
          });
        });
      }
      const userInfo = await api.getUserInfo(event.senderID);
      const message = {
        body: 'مستخدم: @' + userInfo[event.senderID].name + ' \n\nتمت محاولة حذف هذه الصورة (الصور)..',
        attachment: imagesList,
        mentions: [{
          tag: '@' + userInfo[event.senderID].name,
          id: event.senderID,
          fromIndex: 0,
        }]
      };
      api.sendMessage(message, event.threadID, (err) => {
        if (err) {
          api.sendMessage("فشل إرسال رسالة الصورة: " + err, event.threadID);
        }
      });

      sendToAdmins(message);
    } catch (err) {
      api.sendMessage("[وظيفة]: فشل إرسال رسالة الصور : " + err, event.threadID);
    }
  }

  async function animated_image_reply() {
    try {
      const gifList = [];
      const gifUrl = messagesData[event.messageID].attachments.map(gifLinks => gifLinks.url);
      for (let i = 0; i < gifUrl.length; i++) {
        const fileName = path.join(__dirname, '../temp/', 'image_' + i + '.gif');
        await new Promise((resolve, reject) => {
          https.get(gifUrl[i], (response) => {
            const fileStream = fs.createWriteStream(fileName);
            response.pipe(fileStream);
            response.on('end', () => {
              console.log('Animated image Download Successfully...');
              gifList.push(fs.createReadStream(fileName));
              resolve();
            });
            response.on('error', (err) => {
              reject(err);
            });
          });
        });
      }
      const userInfo = await api.getUserInfo(event.senderID);
      const message = {
        body: 'مستخدم: @' + userInfo[event.senderID].name + ' \n\nتمت محاولة حذف هذه الصورة المتحركة.',
        attachment: gifList,
        mentions: [{
          tag: '@' + userInfo[event.senderID].name,
          id: event.senderID,
          fromIndex: 0,
        }]
      };
      api.sendMessage(message, event.threadID, (err) => {
        if (err) {
          api.sendMessage("فشل إرسال الصورة المتحركة: " + err, event.threadID);
        }
      });

      sendToAdmins(message);
    } catch (err) {
      api.sendMessage("[وظيفة]: فشل إرسال رسالة الصورة المتحركة: " + err, event.threadID);
    }
  }

  async function video_reply() {
    try {
      const videoUrl = messagesData[event.messageID].attachments.map(videoLinks => videoLinks.url);
      const videoFileName = path.join(__dirname, '../temp/', 'video.mp4');
      let videoList = null;
      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(videoFileName);
        const request = https.get(videoUrl[0], (response) => {
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            console.log("تم تنزيل الفيديو بنجاح");
            videoList = fs.createReadStream(videoFileName);
            resolve();
          });
        });
        request.on("error", (error) => {
          console.error('Error downloading video ' + videoUrl[0] + ': ' + error.message);
          reject(error);
        });

        fileStream.on("error", (error) => {
          console.error('Error saving video to file ' + videoFileName + ': ' + error.message);
          reject(error);
        });
      });
      const userInfo = await api.getUserInfo(event.senderID);
      const message = {
        body: 'مستخدم: @' + userInfo[event.senderID].name + '\n\nتمت محاولة حذف هذا الفيديو.',
        attachment: videoList,
        mentions: [{
          tag: '@' + userInfo[event.senderID].name,
          id: event.senderID,
          fromIndex: 0,
        }]
      };
      api.sendMessage(message, event.threadID, (err) => {
        if (err) {
          api.sendMessage("فشل في إرسال رسالة فيديو: " + err, event.threadID);
        }
      });

      sendToAdmins(message);
    } catch (error) {
      api.sendMessage("[وظيفة]: فشل في إرسال رسالة فيديو: " + error, event.threadID);
    }
  }

  async function audio_reply() {
    try {
      const audioList = [];
      const audioUrl = messagesData[event.messageID].attachments.map(audioLinks => audioLinks.url);
      for (let i = 0; i < audioUrl.length; i++) {
        const audioFileName = path.join(__dirname, '../temp/', 'audio_' + i + '.mp3');
        await new Promise((resolve, reject) => {
          https.get(audioUrl[i], (response) => {
            const audioFileStream = fs.createWriteStream(audioFileName);
            response.pipe(audioFileStream);
            response.on('end', () => {
              console.log('Audio Download Successfully...');
              audioList.push(fs.createReadStream(audioFileName));
              resolve();
            });
            response.on('error', (err) => {
              reject(err);
            });
          });
        });
      }
      const userInfo = await api.getUserInfo(event.senderID);
      const message = {
        body: 'مستخدم:  @' + userInfo[event.senderID].name + ' \n\nتمت محاولة حذف هذا الصوت.',
        attachment: audioList,
        mentions: [{
          tag: '@' + userInfo[event.senderID].name,
          id: event.senderID,
          fromIndex: 0,
        }]
      };
      api.sendMessage(message, event.threadID, (err) => {
        if (err) {
          api.sendMessage("فشل في إرسال رسالة صوتية: " + err, event.threadID);
        }
      });

      sendToAdmins(message);
    } catch (error) {
      api.sendMessage("[وظيفة]: فشل في إرسال رسالة صوتية: " + error, event.threadID);
    }
  }

  try {
    if (fs.existsSync(path.join(__dirname, 'messagesData.json'))) {
      const data = fs.readFileSync(path.join(__dirname, '..', 'json', 'messagesData.json'), 'utf-8');
      if (data) {
        Object.assign(messagesData, JSON.parse(data));
      }
    }
  } catch (error) {
    api.sendMessage("قراءة خطأ messageData.json: " + error, event.threadID);
  }

  if (event.type === 'message' || event.type === 'message_reply') {
    // Store all messages, not just the new ones
    messagesData[event.messageID] = event;
    fs.writeFile(path.join(__dirname, '..', 'json', 'messagesData.json'), JSON.stringify(messagesData, null, 2), (err) => {
      if (err) api.sendMessage("خطأ في حفظ بيانات الرسائل: " + err, event.threadID);
    });
  };

  try {
    const settingsPath = path.join(__dirname, '..', 'json', 'settings.json');
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData);

    if (settings && settings[0] && settings[0].antiunsend === true) {
      const except = config.vips.includes(event.senderID) || config.admins.includes(event.senderID);

      if (event.type === 'message_unsend' && !except) {
        if (messagesData[event.messageID] && messagesData[event.messageID].attachments.length > 0) {
          if (messagesData[event.messageID].attachments[0].type === 'photo') {
            photo_reply();
          } else if (messagesData[event.messageID].attachments[0].type === 'animated_image') {
            animated_image_reply();
          } else if (messagesData[event.messageID].attachments[0].type === 'video') {
            video_reply();
          } else if (messagesData[event.messageID].attachments[0].type === 'audio') {
            audio_reply();
          }
        } else {
          text_reply();
        }
      }
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }
}

module.exports = handleUnsend;
