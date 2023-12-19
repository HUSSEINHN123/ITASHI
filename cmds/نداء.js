const moment = require('moment-timezone');

async function msgdev(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام : نداء [رسالة إلتي تريد إرسالها إلى المطور]\n\n" +
      "الوصف : قم بإرسال رسالة إلى حسين .\n\n" +
      "مثال : نداء هل يمكنك أن تأتي إلى المجموعة لأنني لم أفهم كيف أستخدم البوت ؟\n\n" +
      "ملاحظة ؟: الأمر يحتاج إلى أن تدخل رسالة التي تريد إرسالها إلى المطور";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const message = input.slice(1).join(' ').trim();
  if (message.length === 0) {
    return api.sendMessage(' ⚠️ | أرجوك قم بإدخال رسالة لإرشالها إلى المطور.', event.threadID);
  }

  const senderID = event.senderID.split(':')[0];
  const userInfo = await api.getUserInfo(senderID);
  const senderName = userInfo && userInfo[senderID] ? userInfo[senderID].name : `@${senderID}`;

  const timezone = 'Africa/Casablanca';
  const date = moment().tz(timezone).format('MM/DD/YY');
  const time = moment().tz(timezone).format('h:mm:ss A');

  const developerMessage = ` 🧾 | لديك رسالة ، سينسي\n من طرف @${senderName}\n\n${message}\n\nالوقت ⏰ : ${time} (${timezone})\n التاريخ 📅 : ${date}`;
  const developerThreadID = '24104736202459260';

  try {
    await api.sendMessage({
      body: developerMessage,
      mentions: [{
        tag: `@${senderName}`,
        id: senderID,
      }],
    }, developerThreadID);

    await api.sendMessage(' ✅ | تم إرسال رسالتك إلى المطور بنجاح', event.threadID);
  } catch (error) {
    console.error('Error sending message to developer:', error);
    return api.sendMessage(' ❌ |حدث خطأ. الرجاء معاودة المحاولة في وقت لاحق.', event.threadID);
  }
}

module.exports = msgdev;
