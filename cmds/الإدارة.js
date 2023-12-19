const path = require('path');
const fs = require('fs');

function readSettings() {
  const settingsPath = path.join(__dirname, '..', 'json', 'settings.json');
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath));

    const formattedSettings = settings.map((item) => {
      const sysStatus = item.system ? '✅ مفعلة' : '❌ معطلة';
      const subscribeStatus = item.subscribe ? 'مفعلة ❌' : 'معطلة ✅' ;
      const autoReactStatus = item.autoreact ? '✅ مفعلة' : '❌ معطلة';
      const antiLeaveStatus = item.antileave ? '✅ مفعلة' : '❌ معطلة';
      const antiUnsendStatus = item.antiunsend ? '✅ مغعلة' : '❌ معطلة';
      const listenEventsStatus = item.listenEvents ? '✅ مغعلة' : '❌ معطلة';
      const selfListenStatus = item.selfListen ? '✅ مفعلة' : '❌ معطلة';
      const autoMarkReadStatus = item.autoMarkRead ? '✅ مفعلة' : '❌ معطلة';
      const autoMarkDeliveryStatus = item.autoMarkDelivery ? '✅ مفعلة' : '❌ معطلة';
      const forceLoginStatus = item.forceLogin ? '✅ مفعلة' : '❌ معطلة';

      return `├─⦿ النظام: ${sysStatus}
├─⦿ مضاد_المغادرة: ${antiLeaveStatus}
├─⦿ التفاعل_التلقائي: ${autoReactStatus}
├─⦿تسحيل_الدخول: ${subscribeStatus}
├─⦿ مضاد_الحذف: ${antiUnsendStatus}
├─⦿ ListenEvents: ${listenEventsStatus}
├─⦿ SelfListen: ${selfListenStatus}
├─⦿ AutoMarkRead: ${autoMarkReadStatus}
├─⦿ AutoMarkDelivery: ${autoMarkDeliveryStatus}
├─⦿ ForceLogin: ${forceLoginStatus}`; 
    });

    return formattedSettings.join('\n');
  } catch (error) {
    console.error('Error reading settings:', error);
    return '❌ An error occurred while reading the settings.';
  }
}

function updateSettings(settingName, value, senderID) {
  const configPath = path.join(__dirname, '..', 'json', 'config.json');
  try {
    const config = JSON.parse(fs.readFileSync(configPath));
    const adminsList = config.admins || [];
    
    if (!adminsList.includes(senderID)) {
      return '🚫 | تم الرفض. لأنه ليس لديك الصلاحية لإستخدام هذا الأمر.';
    }

    const filePath = path.join(__dirname, '..', 'json', 'settings.json');
    const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;

    const updatedSettings = settings.map((item) => {
      for (const key in item) {
        if (key.toLowerCase() === settingName.toLowerCase()) {
          const newValue = value === 'true';
          if (item[key] !== newValue) {
            item[key] = newValue;
            updated = true;
          } else {
            updated = 'nochange';
          }
        }
      }
      return item;
    });

    if (updated === 'nochange') {
      return `⚠️ الإعدادات ${settingName} تم ضبطها بالفعل لتكون  ${value}. لم يم تغيير أي شيء.`;
    }

    fs.writeFileSync(filePath, JSON.stringify(updatedSettings, null, 2));
    return updated
      ? `✅ | الإعدادات ${settingName} تم تحديثها و  ${value} بنجاح.`
      : '❌ | لا إعدادات متطابقة تم إيجادها.';
  } catch (error) {
    console.error('Error updating settings:', error);
    return '❌ An error occurred while updating the settings.';
  }
}

function settingsCommand(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = '💡 كيفية الإستخدام :\n\n' +
      'لكي ترى قائمة الإعدادات :\nالإعدادات\n\n' +
      'من أجل ضبط الإعدادات إستخدم:\nالإدارة -ضبط [إسم الإعدادات] [قيمة]\n\n' +
      'مثال:\nالإدارة -ضبط النظام تفعيل\n\n' +
      'ملاحظة ⚠️: القيمة يحب أن تحون "تفعيل" أو "تعطيل".';
    api.sendMessage(usage, event.threadID);
    returnت;
  }

  if (input.includes('-ضبط')) {
    const settingName = input[input.indexOf('-ضبط') + 1];
    const value = input[input.indexOf('-ضبط') + 2];
    const senderID = event.senderID;

    if (settingName && (value === 'تفعيل' || value === 'تعطيل')) {
      const result = updateSettings(settingName, value, senderID);
      api.sendMessage(result, event.threadID, event.messageID);
    } else {
      api.sendMessage('[❌] | إستعمال غير صالح. أكتب "الإدارة -مساعدة" من أجل تعليمات كيفية إستخدام.', event.threadID, event.messageID);
    }
  } else {
    const settings = readSettings();
    const message = `
┌───[ أوامر الإدارة ]───⦿
│
${settings}
│
└────────⦿
    `;
    api.sendMessage(message, event.threadID, event.messageID);
  }
}

module.exports = settingsCommand;
