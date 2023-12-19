const fs = require('fs');
const path = require('path');

async function handleBotJoin(api, threadID) {
  // Send welcome message with GIF attachment
  const gifFileName = 'itashi.gif';
  const gifPath = path.join(__dirname, 'temp', gifFileName);

  const gifBuffer = fs.readFileSync(gifPath);

  api.sendMessage({
    body: ' ✅ | ٺــم ٺــۄڝــۑْــڶ إٻــٺــٱڜــۑْ بــڼــڃــاح.',
    attachment: gifBuffer,
  }, threadID);
}

module.exports = handleBotJoin;