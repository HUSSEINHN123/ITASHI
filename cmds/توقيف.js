const fs = require('fs');
const path = require('path');

function readConfig() {
  const configPath = path.join(__dirname, '..', 'json', 'config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath));
  } catch (error) {
    console.error('Error reading config:', error);
    return null;
  }
}

function isadmins(userId) {
  const config = readConfig();
  if (config !== null && config.hasOwnProperty('admins')) {
    const adminsList = config.admins || [];
    return adminsList.includes(userId);
  }
  return false;
}

function muteCommand(event, api) {
  if (event.body.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: توقيف [-إضافة/-إزالة] [آيدي المستخدم]\n\n" +
      "الوصف:\n" +
      "  - توقيف -إضافة: إضافة المستخدم المحدد إلى قائمة كتم الصوت.\n" +
      "  - توقيف -إزالة: إزالة المستخدم المحدد من قائمة كتم الصوت.\n\n" +
      "ملاحظة ⚠️: فقط المطور يمكنه إستخدام هذا الأمر";
    api.sendMessage(usage, event.threadID);
    return Promise.resolve();
  }

  const command = event.body.split(' ')[1];

  if (command === '-إضافة' || command === '-إزالة') {
    if (!isadmins(event.senderID)) {
      api.sendMessage(" ⚠️ | ليس لديك الصلاحية لإستخدام هذا الأمر.", event.threadID);
      return Promise.resolve();
    }

    if (command === '-إضافة') {
      return addMutedUser(event, api);
    } else if (command === '-إزالة') {
      return removeMutedUser(event, api);
    }
  } else {
    // Show the list of muted users
    const exceptionList = readExceptionList();
    if (exceptionList !== null && exceptionList.hasOwnProperty('users')) {
      const usersList = exceptionList.users.map(userId => `├─⦿ ${userId}`).join('\n');
      const totalUsers = exceptionList.users.length;
      const message = `
┌────[ المستخدمون الذين تم كتم صوتهم ]────⦿
│
${usersList}
│
└────[ إجمالي المستخدمين الذين تم كتم صوتهم: ${totalUsers} ]────⦿
`;
      api.sendMessage(message, event.threadID);
    } else {
      api.sendMessage(" ❌ |حدث خطأ أثناء قراءة قائمة المستخدمين الذين تم كتم صوتهم.", event.threadID);
    }
    return Promise.resolve();
  }
}

function addMutedUser(event, api) {
  return new Promise((resolve, reject) => {
    const { threadID, messageReply } = event;
    if (!messageReply) return resolve();

    const exceptionListPath = path.join(__dirname, '..', 'json', 'exceptionList.json');
    const exceptionList = readExceptionList();
    const usersList = exceptionList.users || [];

    const userId = messageReply.senderID;

    api.getUserInfo(parseInt(userId), (error, data) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      const name = data[userId].name;
      if (usersList.includes(userId)) {
        api.sendMessage(`${name} is already muted.`, threadID);
        resolve();
      } else {
        usersList.push(userId);
        exceptionList.users = usersList;
        fs.writeFileSync(exceptionListPath, JSON.stringify(exceptionList, null, 2), "utf8");
        api.sendMessage(` ✅ | العضو  ${name} تم كتم صوته بنجاح.`, threadID);
        resolve();
      }
    });
  });
}

function removeMutedUser(event, api) {
  return new Promise((resolve, reject) => {
    const { threadID, messageReply } = event;
    if (!messageReply) return resolve();

    const exceptionListPath = path.join(__dirname, '..', 'json', 'exceptionList.json');
    const exceptionList = readExceptionList();
    const usersList = exceptionList.users || [];

    const userId = messageReply.senderID;

    api.getUserInfo(parseInt(userId), (error, data) => {
      if (error) {
        console.error(error);
        return reject(error);
      }

      const name = data[userId].name;

      if (usersList.includes(userId)) {
        const removeIndex = usersList.indexOf(userId);
        usersList.splice(removeIndex, 1);
        exceptionList.users = usersList;
        fs.writeFileSync(exceptionListPath, JSON.stringify(exceptionList, null, 2), "utf8");
        api.sendMessage(` ❌ | العضو ${name} لم يعد مكتوم الصوت بعد الآن .`, threadID);
        resolve();
      } else {
        api.sendMessage(` ⚠️ | العضو ${name} لم يعد في قائمة الأعضاء اللذين تم كتم صوتهم .`, threadID);
        resolve();
      }
    });
  });
}

function readExceptionList() {
  const exceptionListPath = path.join(__dirname, '..', 'json', 'exceptionList.json');
  try {
    return JSON.parse(fs.readFileSync(exceptionListPath));
  } catch (error) {
    console.error('Error reading exception list:', error);
    return null;
  }
}

module.exports = muteCommand;
