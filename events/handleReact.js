  const fs = require("fs").promises;
const path = require("path");

async function handleReact(api, event) {
  const settingsPath = path.join(__dirname, '..', 'json', 'settings.json');
  try {
    const settingsData = await fs.readFile(settingsPath, "utf8");
    const settings = JSON.parse(settingsData);

    if (event && event.body && typeof event.body === "string") {
      if (settings && settings[0] && settings[0].autoreact === true) {
        const keywordReactions = {
          "سعيد": "😊",
          "حزين": "😔",
          "غاضب": "😠",
          "متفاجئ": "😲",
          "متحمس": "😃",
          "يشعر بالملل": "😒",
          "حب": "❤️",
          "يكره": "🤬",
          "متعب": "😴",
          "يضحك": "😂",
          "متوثر": "😕",
          "يغمز": "😉",
          "يفكر": "🤔",
          "يبكي": "😭",
          "يبتسم": "😊",
          "غاضب": "😰",
          "مسترخي": "😌",
          "متشكك": "🤨",
          "هادئ": "😌",
          "هههه": "🤣"
        };

        for (const keyword of Object.keys(keywordReactions)) {
          if (event.body.includes(keyword)) {
            const reaction = keywordReactions[keyword];
            api.setMessageReaction(reaction, event.messageID, (err) => {
             /* if (err) {
                console.error("Error applying reaction:", err);
              } else {
                console.log(`Reaction '${reaction}' applied to message.`);
              }*/
            }, true);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading settings.json:", error);
  }
}

module.exports = handleReact;
  
