const moment = require('moment-timezone');

async function systemStatus(event, api) {
  const input = event.body.toLowerCase().trim();

  if (input.includes("-مساعدة")) {
    const usage = "كيفية الإستخدام: مدة_التشغيل\n\n" +
      "الوصف : يجلب لك معلومات حول حالة البوت الحالي.\n";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const currentTime = moment().tz('Africa/Casablanca').format('YYYY-MM-DD hh:mm:ss A');

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime - (hours * 3600)) / 60);
  const seconds = Math.floor(uptime % 60);
  const uptimeStr = `النظام شغال منذ  ${hours} ساعة، ${minutes} دقيقة، و ${seconds} ثانية`;

  const threads = await api.getThreadList(99999, null, ['INBOX']);

  let userCount = 0;
  let groupCount = 0;

  threads.forEach(thread => {
    if (thread.isGroup) {
      groupCount++;
    } else {
      userCount++;
    }
  });

  const output = `🤖 حالة النظام \n\n` +
    `الوقت الحالي : ${currentTime},\n` +
    ` إجمالي عدد المستخدمين : ${userCount}\n` +
    `إجمالي عدد المجموعات : ${groupCount}\n\n` +
    `${uptimeStr}`;

  api.sendMessage(output, event.threadID);
}

module.exports = systemStatus;
