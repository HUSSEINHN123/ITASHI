const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const path = require('path');
const apiKeysPath = path.join(__dirname, '..', 'json', 'api_config.json');
const apiKeys = JSON.parse(fs.readFileSync(apiKeysPath));
const openaiApiKey = apiKeys.openai;

async function aika(event, api) {
  const text = event.body.substring(5);
  const query = text.trim();
  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });

  if (!query) {
    api.sendMessage("ساكورا: يرجى تقديم رسالة للذكاء الاصطناعي للرد عليها 🙂.", event.threadID);
    return;
  }

  api.sendMessage(" 🔎 | ساكورا تبحث عن إجابة...", event.threadID);

  try {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          "role": "system",
          "content": `Pretend to be Aika, a 14-year-old Japanese girl who is incredibly intelligent and knowledgeable about everything. Have a conversation with me using colloquial Japanese English language to make it feel authentic.`
        },
        {
          "role": "user",
          "content": `${query}?`
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
    });

    const assistantResponse = response.data.choices[0].message.content;
    api.sendMessage(`📝 : ${assistantResponse}`, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(" ❌ | ساكور : حدث خطأ أثناء معالجة طلبك. الرجاء معاودة المحاولة في وقت لاحق.", event.threadID, event.messageID);
  }
}

module.exports = aika;
