const google = require('googlethis');

async function translateText(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: ترجمة [نص] إلى [لغة أخرى]\n\n" +
      "الوصف : قم بترجمة النصوص من اللغة اللتي تحتاج ترجمة إلى اللغة المحددة التي اريد أن يترجم إليها النص.\n\n" +
      "مثال : ترجمة hello how are you today ?";
    api.sendMessage(usage, event.threadID);
    return;
  }

  const text = input.slice(1, input.indexOf('إلى')).join(' ');
  const targetLanguage = input[input.indexOf('إلى') + 1];
  const options = {
    additional_params: {
      hl: 'ar'
    }
  };

  try {
    const query = `تمت الترجمة من  ${text} إلى ${targetLanguage}`;
    const response = await google.search(query, options);
    const translation = response.translation;

    if (translation) {
      let message = '';

      message += `مصدر النص : ${translation.source_language}\n`;
      message += `اللفة المستهدفة : ${translation.target_language}\n`;
      message += `مصدر النص : ${translation.source_text}\n`;
      message += `النص المستهدف : ${translation.target_text}\n`;

      api.sendMessage(message, event.threadID).catch((err) => {
        console.error(`Error sending message: ${err}`);
      });
    } else {
      api.sendMessage(' ⚠️ |لم يتم إيجاد أي ترجمة بالنسبة لهذه اللغة.', event.threadID).catch((err) => {
        console.error(`Error sending message: ${err}`);
      });
    }
  } catch (err) {
    console.error(`Error translating text: ${err}`);
    api.sendMessage(' ❌ |فشل ترجمة النص المرجو المحاولة لاحقا.', event.threadID).catch((err) => {
      console.error(`Error sending message: ${err}`);
    });
  }
}

module.exports = translateText;
