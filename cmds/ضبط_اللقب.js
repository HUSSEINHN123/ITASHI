async function nickname(event, api) {
  const {
    threadID,
    messageID,
    mentions,
    senderID
  } = event;

  const input = event.body.trim();
  const txt = input.substring(6).split(" ").join().replace(/,/g, " ").split("@");
  const mention = Object.keys(mentions);

  if (input.includes("-مساعدة")) {
    const usage = "كيفية_الإستخدام: ضبط_اللقب [اللقب] [@منشن] [@منشن2] ...\n\n" +
      "الوصف : قم بضبط اللقب لنفسك أو للمستخدمين اللذين تم عمل منشن لهم.\n\n" +
      "مثال: ضبط_اللقب المدمر @المستخدم1 @المستخدم2\n\n" +
      "ملاحظة ⚠️: إستخدم '@الكل' لتعيين اللقب لجميع الأعضاء في المجموعة.";
    api.sendMessage(usage, threadID);
    return;
  }

  if ((mention[0] == undefined) && (!input.includes("@الكل"))) {
    api.changeNickname(txt[0], threadID, senderID, (err) => {
      if (err) return api.sendMessage("⚠️[خطأ]⚠️" + err.error, threadID, messageID);
    });
  } else if ((txt[0].length < 1) && (!input.includes("@الكل"))) {
    for (let i = 0; i < mention.length; i++) {
      const gcm = mention[i];
      api.changeNickname("", threadID, gcm, (err) => {
        if (err) return api.sendMessage("⚠️[خطأ]⚠️" + err.error, threadID, messageID);
      });
    }
  } else if (input.includes("@الكل")) {
    api.getThreadInfo(threadID, (err, gc) => {
      if (err) return console.error(err);
      if (gc) {
        for (let i = 0; i < gc.participantIDs.length; i++) {
          setTimeout(function timer() {
            api.changeNickname(txt[0], threadID, gc.participantIDs[i], (err) => {
              if (err) return console.error(err);
            });
          }, i * 2500);
        }
      }
    });
  } else if ((txt[0].length < 1) && (input.includes("@الكل"))) {
    api.getThreadInfo(threadID, (err, gc) => {
      if (err) return console.error(err);
      if (gc) {
        for (let i = 0; i < gc.participantIDs.length; i++) {
          setTimeout(function timer() {
            api.changeNickname("", threadID, gc.participantIDs[i], (err) => {
              if (err) return console.error(err);
            });
          }, i * 2500);
        }
      }
    });
  } else {
    for (let i = 0; i < mention.length; i++) {
      const gcm = mention[i];
      api.changeNickname(txt[0], threadID, gcm, (err) => {
        if (err) return api.sendMessage("⚠️[خطأ]⚠️" + err.error, threadID, messageID);
      });
    }
  }
}

module.exports = nickname;
