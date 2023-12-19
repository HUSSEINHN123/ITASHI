const axios = require('axios');
const fs = require('fs');

async function periodic(event, api, input) {
  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: جدول_الدوري [العناصر]\n\n" +
      "الوصف : يسترجع معلومات حول العنصر الكيميائي المحدد من الجدول الدوري.\n\n" +
      "مثال: الجدول_الدوري FE\n\n" +
      "ملاحظة ⚠️: يتوقع الأمر اسم العنصر الكيميائي كوسيطة.";
    api.sendMessage(usage, event.threadID);
    return;
  }

  let data = input.split(" ");
  data.shift();

  if (data.length > 0) {
    try {
      const response = await axios.get("https://api.popcat.xyz/periodic-table?element=" + data.join(" "));
      const elementData = response.data;

      const imageResponse = await axios.get(elementData.image, {
        responseType: "stream"
      });
      const imagePath = __dirname + "/../temp/element.png";
      const imageStream = fs.createWriteStream(imagePath);
      imageResponse.data.pipe(imageStream);

      await new Promise((resolve, reject) => {
        imageStream.on("finish", () => {
          const message = {
            body: `${elementData.name}\n\nالرمز : ${elementData.symbol}\nالعدد الذري : ${elementData.atomic_number}\nالكتلة الذرية : ${elementData.atomic_mass}\nفترة : ${elementData.period}\nمرحلة : ${elementData.phase}\nأكتشف من قبل : ${elementData.discovered_by}\n\nملخص\n${elementData.summary}`,
            attachment: fs.createReadStream(imagePath),
          };
          api.sendMessage(message, event.threadID, event.messageID)
            .then(() => resolve())
            .catch((error) => reject(error));
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(" ❌ |حدث خطأ أثناء استرداد البيانات للعنصر المقدم.", event.threadID, event.messageID);
    }
  } else {
    api.sendMessage(` ⚠️ | طلب غير محدد .\n\nالجدول_الدوري <العنصر>`, event.threadID, event.messageID);
  }
}

module.exports = periodic;
