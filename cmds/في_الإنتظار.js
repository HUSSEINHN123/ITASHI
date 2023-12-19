const path = require('path');
const fs = require('fs');

let pendingThreads = [];

async function pendingCommand(event, api) {
  const { body, threadID } = event;
  const senderID = event.senderID;
  const command = body.split(' ')[1];

  if (command === '-مساعدة') {
    const usage = "كيفية الإستعمال:\n" +
      "- من أجل أنت ترى قائمة المجموعات اللتي تنتظر موافقة إستعمل: `في_الإنتظار`\n" +
      "- من أجل قبول المجموعات في ردهة الانتظار: `في_الإنتظار -قبول [الرقم]`\n" +
      "- من أجل إلغاء مجموعة في ردهة الإنتظار إستخدم: `في_الإنتزار -إلغاء [الرقم]`";

    api.sendMessage(usage, threadID);
    return;
  }

  if (command === '-قبول' || command === '-إلغاء') {
    const selectedThreads = body
      .split(/\s+/)
      .map(Number)
      .filter((num) => !isNaN(num) && num > 0 && num <= pendingThreads[senderID].length);

    if (selectedThreads.length === 0) {
      api.sendMessage(' ⚠️ | إختيار غير صالح المرجو إختيار رقم بعدها قبول أو إلغاء من أجل إضافتها أو إلغائها من ردهة الإنتظار.', threadID);
    } else {
      const acceptedThreads = [];
      const canceledThreads = [];

      for (const selectedThread of selectedThreads) {
        const index = selectedThread - 1;
        const threadInfo = pendingThreads[senderID][index];
        if (threadInfo) {
          if (threadInfo.action === 'accept') {
            acceptedThreads.push(threadInfo.threadID);
          } else if (threadInfo.action === 'cancel') {
            canceledThreads.push(threadInfo.threadID);
          }
        }
      }

      if (acceptedThreads.length > 0) {
        api.sendMessage(`المجموعات اللتي تم قبولها هي ${acceptedThreads.length} مجموعة في الإنتظار.`, threadID);
        acceptedThreads.forEach((threadID) => {
          api.sendMessage(' ✅ |تمت الموافقة على المجموعة من طرف المطور \n------------\nالبوت لا يحتاج إستخدام رمز فقط إستخدم \n------------------\nأوامر أو مساعدة لترى قائمة الأوامر \n----------------\nرابط حساب المطور : https://www.facebook.com/profile.php?id=100076269693499\n-----------------\nإذا كان هناك أي مشاكل يرحى التواصل معي\nنهاركم سعيد 🤙 ', threadID);
        });
      }

      if (canceledThreads.length > 0) {
        api.sendMessage(` ❎ | ' تم رفض ' ${canceledThreads.length} مجموعة في ردهة الإنتظار.`, threadID);
        canceledThreads.forEach((threadID) => {
          api.removeUserFromGroup(senderID, threadID);
        });
      }

      delete pendingThreads[senderID];
    }
  } else {
    try {
      const pendingThreadsList = await getPendingThreads(api);
      if (pendingThreadsList.length > 0) {
        const pendingListMessage = generatePendingListMessage(pendingThreadsList);
        api.sendMessage(pendingListMessage, threadID);
        pendingThreads[senderID] = pendingThreadsList;
      } else {
        api.sendMessage(' [❗] |لا يوجد أي مجموعة في ردهة الإنتظار.', threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(' ❌ |حدث خطأ أثناء جلب قائمة الجموعات.', threadID);
    }
  }
}

async function getPendingThreads(api) {
  const spamThreads = await api.getThreadList(100, null, ['OTHER']);
  const pendingThreads = await api.getThreadList(100, null, ['PENDING']);
  const allThreads = [...spamThreads, ...pendingThreads];
  const pendingThreadsList = allThreads
    .filter((thread) => thread.isSubscribed && thread.isGroup)
    .map((thread) => ({ threadID: thread.threadID, action: 'accept' }));
  return pendingThreadsList;
}

function generatePendingListMessage(pendingThreadsList) {
  let message = ' ✨ قائمة المجموعات في الإنتظار:\n';
  pendingThreadsList.forEach((thread, index) => {
    message += `${index + 1}. آيدي المجموعة : ${thread.threadID}\n`;
  });
  message += ' [⚠️] |من أجل أن تقبل أو ترفض مجموعة في ردهة الإنتظار, إستخدم "في_الإنتظار -قبول [الرقم]" أو "في_الإنتظار -إلغاء [الرقم]".';
  return message;
}

module.exports = pendingCommand;
