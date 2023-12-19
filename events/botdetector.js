const fs = require("fs");
const path = require('path');

const exceptionListPath = path.join(__dirname, '..', 'json', 'exceptionList.json');
const configPath = path.join(__dirname, '..', 'json', 'config.json');

async function isBot(api, event) {
  if (typeof event.body === 'string') {
    const userMessage = event.body.toLowerCase();

    const botMessageFragments = [
      "لقد إرتفع مستواك بالبوت",
      "تم تشغيل القفل ولن يخرج اي أحد",
      "تعالو شوفو إيش حذف",
      "إشعار من المطور",
      "ulul bitch dika makakaalis tanginamo",
      "iyong ka pogian nasa level na",
      "صباح الخير جميعا 😏",
      "[المشرف] قائمة المشرفين",
      "معلومات حول البوت و المطوؤ",
      "حدث خطأ أثناء",
      "قائمة الأوامر",
      "قام بحذف رسالة",
      "لا تحذف و أنا هنا",
      "هذا هو الرمز الحاص بي",
      "page cmds",
      "have a nice day ❤️",
      "لقد إرتفع مستواك إلى مستوى",
      "قم بالرد على هذه الرسالة بالرقم",
      "بادئتي الخاصة هي",
      "المجموعة",
      "مرحبا بك يا",
      "أنت العضو",
      "مرحبا بك في هذه المجموعة",
      "كيف يمكنني أن أساعدك اليوم ؟",
      "كيف يمكنني أن أخدمك اليوم ؟",
      "تحديث المجموعة",
      "تحديث المستخدم",
      "تم تغيير إسم المجموعة إلى",
      "كذكاء إصطناعي فانا لا استطيع الإجابة على هذا السؤال",
      "كنموذج لغوي فإنني لا أستطيع الإجابة على هذا السؤال",
      "as an ai",
      "هناك خطأ ما",
      "إشعار من المطور",
      "رك على هذه الرسالة من أجل المتابعة في مراسلة المطور",
      "غادر المجموعة بكرامته",
      "لقد غادر المجموعة",
      "الأمر اللذي تستخدمه غير موجود هل هذا ",
      "أم لا",
      "automated greeting",
      "تم طرده من المجموعة",
      "as an ai language",
      "تحتاج هذه المجموعة إلى موافقة",
      "𝗉𝗅𝖺𝗒𝗌𝖻𝗈𝗍",
      "you are requesting to ban user"
    ];

    if (!isAdminOrVIP(event.senderID) && botMessageFragments.some(fragment => userMessage.includes(fragment.toLowerCase()))) {
      try {
        const exceptionListData = fs.readFileSync(exceptionListPath, 'utf-8');
        const exceptionList = JSON.parse(exceptionListData);

        if (!exceptionList.bots.includes(event.senderID)) {
          exceptionList.bots.push(event.senderID);
          fs.writeFileSync(exceptionListPath, JSON.stringify(exceptionList, null, 2));

          const userInfo = await api.getUserInfo(event.senderID);
          const confirmationMessage = `**تحديد تلقائي للبوتات**

 ⚠️ | تم تحديدك من كلامك على أنك بوت:

آيدي المستخدم: ${event.senderID}
إسم المستخدم: ${userInfo[event.senderID].name}

تمت إضافة هذا المستخدم إلى قائمة الاستثناءات لمنع البريد العشوائي والحفاظ على بيئة آمنة.`;

          api.sendMessage(confirmationMessage, event.threadID);
        }
      } catch (err) {
        console.error("Error while processing isBot event:", err);
      }
    }
  }
}

function isAdminOrVIP(userID) {
  const configData = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configData);

  return config.admins.includes(userID) || config.vips.includes(userID);
}

module.exports = isBot;
