async function unsend(event, api) {
  if (event.body.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: حذف\n\n" +
      "الوصف: قم بحذف الرسالة اللتي تتم الرد عليها.\n\n" +
      "ملاحظة ⚠️ : لا يتطلب هذا الأمر أية وسائط.";
    api.sendMessage(usage, event.threadID);
    return Promise.resolve();
  }

  if (event.type === "message_reply") {
    const messageReplyId = event.messageReply.messageID;
    api.unsendMessage(messageReplyId);
  }
}

module.exports = unsend;
