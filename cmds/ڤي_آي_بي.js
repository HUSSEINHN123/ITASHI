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

function isadmins(userId, config) {
  const adminsList = config.admins || [];
  return adminsList.includes(userId);
}

function VIPCommand(event, api) {
  const config = readConfig();

  if (event.body.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: ڤي_آي_بي [-إضافة/-إزالة] [قم بالرد على الأعضاء ]\n\n" +
      "الوصف:\n" +
      "  - ڤي_آي_بي -إضافة: قم بإضافة الأعضاء إلى قائمة الشخصيات المهمة.\n" +
      "  - ڤي_آي_بي -إزالة: قم بإزالة الأعضاء من قائمة الأشخاص المهمين.\n\n" +
      "ملاحظة ⚠️: يمكن للمسؤولين فقط استخدام هذا الأمر من خلال الرد على رسالة المستخدم.";
    api.sendMessage(usage, event.threadID);
    return Promise.resolve();
  }

  const command = event.body.split(' ')[1];

  if (command === '-إضافة' || command === '-إزالة') {
    if (!isadmins(event.senderID, config)) {
      api.sendMessage(" ⚠️ | ليس لديك الصلاحية لإستخدام هذا الأمر.", event.threadID);
      return Promise.resolve();
    }

    if (command === '-إضافة') {
      return addVIP(event, api, config);
    } else if (command === '-إزالة') {
      return remVIP(event, api, config);
    }
  } else {
    const vipList = config.vips || [];
    const totalVIPs = vipList.length;
    const message = `
┌────[  ⚜️ قائمة المستخدمين المهمين ⚜️ ]────⦿
│
${vipList.map(userId => `├─⦿ ${userId}`).join('\n')}
│
└────[إجمالي عدد المستخدمين المهمين جدا : ${totalVIPs}]────⦿
`;
    api.sendMessage(message, event.threadID);
    return Promise.resolve();
  }
}

function addVIP(event, api, config) {
  return new Promise((resolve, reject) => {
    const { threadID, messageReply } = event;
    if (!messageReply) return resolve();

    const userId = messageReply.senderID;

    api.getUserInfo(parseInt(userId), (error, data) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      const name = data[userId].name;
      const vipList = config.vips || [];

      if (vipList.includes(userId)) {
        api.sendMessage(` ⚠️  | ${name} هو بالفعل في قائمة الشخصيات المهمة `, threadID);
        resolve();
      } else {
        vipList.push(userId);
        config.vips = vipList;
        updateConfig(config); 
        api.sendMessage(` ✅ | تمت إضافة العضو ${name} بنجاح إلى قائمة الشخصيات المهمة جدا `, threadID);
        resolve();
      }
    });
  });
}

function remVIP(event, api, config) {
  return new Promise((resolve, reject) => {
    const { threadID, messageReply } = event;
    if (!messageReply) return resolve();

    const userId = messageReply.senderID;

    api.getUserInfo(parseInt(userId), (error, data) => {
      if (error) {
        console.error(error);
        return reject(error);
      }

      const name = data[userId].name;
      const vipList = config.vips || [];

      if (vipList.includes(userId)) {
        const removeIndex = vipList.indexOf(userId);
        vipList.splice(removeIndex, 1);
        config.vips = vipList; 
        updateConfig(config); 
        api.sendMessage(`تمت إزالة  ${name} من قائمة الشخصيات المهمة بنجاح ✅`, threadID);
        resolve();
      } else {
        api.sendMessage(` ❗ | العضو ${name} لم يتم إيجاده في قائمة الشخصيات المهمة `, threadID);
        resolve();
      }
    });
  });
}

function updateConfig(config) {
  const configPath = path.join(__dirname, '..', 'json', 'config.json');
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error updating config:', error);
  }
}

module.exports = VIPCommand;
