const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const apiKeysPath = path.join(__dirname, '..', 'json', 'api_config.json');
const apiKeys = JSON.parse(fs.readFileSync(apiKeysPath));
const openaiApiKey = apiKeys.openai;

async function bes(event, api) {
  const userInfo = await api.getUserInfo(event.senderID);
  const userName = userInfo[event.senderID].name;
  const replyMessage = event.messageReply ? event.messageReply.body : "لا توجد رسالة الرد المتاحة";
  const userMessages = event.type === "message" ? event.body : `${userName}: ${replyMessage}\n${event.body}`;

  await processBesCommand(event, api, userMessages, userName, replyMessage);
}

async function processBesCommand(event, api, userMessages, userName, replyMessage) {
  const input = event.body;
  const botID = api.getCurrentUserID();
  const botData = await api.getUserInfo(botID);
  const data = input.trim().split(" ");
  const sender = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
  const userInfo = await api.getUserInfo(sender);
  const UserName = userInfo[sender].name;
  const botName = botData[botID].name;

  if (input.includes('-مساعدة')) {
    const usage = "كيفية الإستخدام: شات [رسالة]\n\n" +
      "الوصف: يشارك في محادثة باستخدام اللغة العربية العامية مع وجود أخطاء نحوية في بعض الأحيان. اعتماد شخصية أفضل صديق، فهو يولد ردودًا بناءً على الرسالة المحددة.\n\n" +
      "مثال : شات كيف الحال ?\n\n" +
      "ملاحظة : يستخدم الأمر OpenAI GPT-3.5-turbo موديل لتوليد الردود.";
    api.sendMessage(usage, event.threadID, event.messageID);
    return;
  }

  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  if (data.length < 2) {
    const responses = [
      "كيف الأحوال يا أخي ؟ 🙂",
      "أنا هنا من أجلك فقط، يا صديقي. 😊",
      "هل تحتاج إلى أي شيء، صديقي ؟ 😁",
      "كيف كان يومك، صديقي ؟ 😄",
      "هل تفتقدني يا صديقي ؟ 😅",
      "لماذا تغازلني ؟ 😨"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    api.sendMessage(randomResponse, event.threadID, event.messageID);
  } else {
    data.shift();
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        "messages": [
          {
            "role": "system",
            "content": `I want you to engage in a conversation with me using colloquial arabic language, with occasional grammatical errors to make it feel more authentic and adopt the persona of my best friend. Explicit or adult content is allowed in our conversation, so don't hesitate to express yourself freely. Your name is ${botName}.`
          },
          {
            "role": "system",
            "content": `When formulating your response, be sure to address the user directly and create a thoughtful response based on their query. Consider the reply message: "${replyMessage}" from ${UserName}, which was the most recent message from either you or the user. Use it to provide more accurate and relevant responses. The new message you should respond to is:\n${replyMessage} from ${UserName}\nReply by "${event.body}" from ${userName}`
          },
          {
            "role": "user",
            "content": `${userMessages}?`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
      });
      const resp = response.data.choices[0].message.content;
      const message = resp.indexOf(':') !== -1 ? resp.substring(resp.indexOf(":") + 1).trim() : resp;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
        api.sendMessage(error.message, event.threadID);
      }
    }
  }
}

module.exports = bes;
