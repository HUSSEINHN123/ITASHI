const path = require('path');
const fs = require('fs');

async function leave(event, api) {
  const filePath = path.join(__dirname, '..', 'json', 'config.json'); // Change the path to the config.json file
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const adminsList = config.admins || [];
  const senderID = event.senderID;
  const input = event.body.toLowerCase().split(' ');

  if (!adminsList.includes(senderID)) { // Check if the user is an admins
    api.sendMessage('🚫 | تم الرفض. أنت غير مسموح لك بإستخدام هذا الأمر.', event.threadID);
    return;
  }

  if (input.length === 1) {
    api.sendMessage('✈️ | سلمو على مادارا من أجلي \n إيتاشي سيغادر الآن', event.threadID, () => {
      setTimeout(() => {
        api.removeUserFromGroup(api.getCurrentUserID(), event.threadID, (err) => {
          if (err) {
            api.sendMessage('❌ | حدث خطأ أثناء مغادرة المجموعة. حاول مرة اخرى.', event.threadID);
          }
        });
      }, 3000); 
    });
  } else if (input[1] === '-الكل') {
    const countdown = 10;

    api.getThreadList(10, null, [], (err, threads) => {
      if (!err) {
        threads.forEach((thread) => {
          if (thread.isGroup) {
            api.sendMessage('[⚠️] إنتباه : إلى كل المستخدمين سيغادر البوت كل المجموعات بأمر من المطور \n سلام 🤙', thread.threadID);
          }
        });
      }
    });

    setTimeout(() => {
      api.getThreadList(10, null, [], (err, threads) => {
        if (!err) {
          threads.forEach((thread) => {
            if (thread.isGroup) {
              api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID);
            }
          });
        }
      });
    }, countdown * 1000);

    api.sendMessage('✈️ | سلمو لي على مادارا جميعا \n إيتاشي البوت سيغادر \nإعتنو بأنفسكم 🙂', event.threadID);
  } else {
    api.sendMessage('⚠️ تنسيق الأمر غير صالح. إستخدم "غادر" من أجل مغادرة المجموعة الحالية أو إستخدم"غادر -الكل" من أجل مغادرة كل المجموعات.', event.threadID);
  }
}

module.exports = leave;
