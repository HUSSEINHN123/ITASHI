const axios = require('axios');

async function tempmail(event, api) {
  const input = event.body;
  const data = input.split(" ");

  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام:\n" +
      "البريد_المؤقت -توليد [@تاغ]: يُنشئ عنوان بريد إلكتروني فريدًا باستخدام المنشن .\n" +
      "البريد_المؤقت -صندوق_الورائد: قم بتغقد الرسائل للإيميل في صندوق الورائد.\n\n" +
      "مثال:\n" +
      "بريد_مؤقت -توليد hussein\n" +
      "بريد_مؤقت -صندوق_الورائد\n\n" +
      "ملاحظة ⚠️: يمكن أن يكون المنشن أي قيمة أبجدية رقمية لإنشاء عنوان بريد إلكتروني.";
    api.sendMessage(usage, event.threadID);
    return;
  }

  if (input.includes("-gen")) {
    const tag = data[2];
    if (!tag) {
      await api.sendMessage("⚠️ أرجوم قم لإدخال منشن لتوليد بريد الكتروني الخاص بك . إستخدم -توليد [تاغ@]", event.threadID);
      return;
    }
    const email = `d8h98.${tag}@inbox.testmail.app`;
    await api.sendMessage(`📧 | عنوان بريدك الإلكتروني الفريد هو: ${email}`, event.threadID);
  } else if (input.includes("-البريد_الإلكتروني")) {
    const APIKEY = "e2298007-6128-46be-a787-088262816000";
    const NAMESPACE = "d8h98";
    const apiUrl = `https://api.testmail.app/api/json?apikey=${APIKEY}&namespace=${NAMESPACE}&pretty=true`;

    try {
      const response = await axios.get(apiUrl);
      const emails = response.data.emails.filter((email) => Date.now() - email.timestamp <= 2 * 60 * 60 * 1000);
      const count = emails.length;
      let message = `✉️ | لديك  ${count} رسالة:\n\n`;

      emails.forEach((email) => {
        const subject = email.subject;
        const from = email.from;
        const date = new Date(email.timestamp).toLocaleString("en-US", { timeZone: "Africa/Casablanca" });
        const text = email.text || email.html;
        const to = email.to;
        const id = email.id;
        const downloadUrl = email.downloadUrl;
        const attachments = email.attachments;
        let attachmentMsg = "";

        if (attachments.length > 0) {
          attachmentMsg += "\n📎 المرفقات:";
          attachments.forEach((attachment) => {
            attachmentMsg += `\n📁 إسم الملف: ${attachment.filename}\n📂 النوع: ${attachment.contentType}\n🗂️ حجم الملف: ${attachment.size}\n⬇️ رابط التحميل: ${attachment.downloadUrl}`;
          });
        }

        message += `📬 من: ${from}\n✉️ إلى : ${to}\n📅 الناريخ : ${date}\n📧 الموضوع : ${subject}\n📜 الرسالة :\n\n${text}${attachmentMsg}\n\n`;
      });

      message = message.trim();
      await api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
      await api.sendMessage("❌ | فشل في استرداد رسائل البريد الإلكتروني", event.threadID);
    }
  } else {
    await api.sendMessage("⚠️ | إستخدام غير صالح! إستعمل -مساعدة من أجل معرفة كيفية إستخدام الأمر.", event.threadID);
  }
}

module.exports = tempmail;
