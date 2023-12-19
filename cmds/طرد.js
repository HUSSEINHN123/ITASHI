async function kick(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: طرد\n\n" +
      "الوصف: طرد عضو من المجموعة أو طرد جميع الأعضاء.\n\n" +
      "إرشاد:\n" +
      "-الكل: يقوم بطرد جميع الأعضاء من المجموعة بما في ذالك البوت بنفسه.\n\n" +
      "مثال:\n" +
      "1. قم بطرد عضو قمت بعمل منشن له:\n" +
      "   طرد @إسم_العضو\n" +
      "2. قم بطرد عضو من خلال الرد على رسالته:\n" +
      "   طرد (قم بالرد على رسالة العضو اللذي تريد طرده)\n" +
      "3. طرد جميع الأعضاء من المجموعة بما في ذالك البوت:\n" +
      "   طرد -الكل\n\n" +
      "ملاحظة ⚠️: تحتاج إلى صلاحية خاصة من أجل إستخدام هذا الأمر.";

    api.sendMessage(usage, event.threadID);
    return;
  }

  const botUserID = api.getCurrentUserID();

  if (input.includes('-الكل')) {
    api.getThreadInfo(event.threadID, async (err, gc) => {
      if (err) {
        console.error(err);
        api.sendMessage("⚠️ |فشل في استرداد معلومات المجموعة.", event.threadID);
        return;
      }

      const participantIDs = gc.participantIDs.filter(id => id !== botUserID);

      if (participantIDs.length === 0) {
        api.sendMessage(" ❗ |لم يتم العثور على مشاركين في المجموعة.", event.threadID);
        return;
      }

      const kickedUserNames = [];

      for (const participantID of participantIDs) {
        try {
          await api.removeUserFromGroup(participantID, event.threadID);
          const userInfo = await api.getUserInfo(participantID);
          const userName = userInfo[participantID].name || "Unknown User";
          kickedUserNames.push(userName);
        } catch (err) {
          console.error(err);
        }
      }

      try {
        await api.removeUserFromGroup(botUserID, event.threadID);
        const kickedUserList = kickedUserNames.length > 0 ? kickedUserNames.join(', ') : "None";
        api.sendMessage(` ✅ | كل أعضاء المجموعة تم طردهم بنجاح \nالأعضاء المطرودين : ${kickedUserList}. لقد غادر البوت من تلقاء نفسه.`, event.threadID);
      } catch (err) {
        console.error(err);
        api.sendMessage(" ❌ | فشلت عملية المغادرة وسيبقى البوت في المجموعة .", event.threadID);
      }
    });
  } else if (event.type === "message_reply") {
    const messageReplyId = event.messageReply.messageID;
    const targetUserID = event.messageReply.senderID;

    api.removeUserFromGroup(targetUserID, event.threadID, (err) => {
      if (err) {
        console.error(err);
        api.sendMessage(" ❌ | لا أستطيع طرد هذا العضو.", event.threadID);
      } else {
        api.unsendMessage(messageReplyId);
        api.sendMessage(" ✅ | تم طرد العضو بنجاح.", event.threadID);
      }
    });
  } else if (Object.keys(event.mentions).length !== 0) {
    const targetUserID = Object.keys(event.mentions)[0];

    api.removeUserFromGroup(targetUserID, event.threadID, (err) => {
      if (err) {
        console.error(err);
        api.sendMessage(" ❌ | لم استطع طرد المستخدم من المجموعة.", event.threadID);
      } else {
        api.sendMessage(" ✅ | تم طرد العضو من المجموعة بنجاح .", event.threadID);
      }
    });
  } else {
    api.sendMessage(" ⚠️ | طريقة الإستخدام غير صالحة. إستخدم 'طرد -مساعدة' من أجل مزيد من المعلومات.", event.threadID);
  }
}

module.exports = kick;
