const fs = require('fs');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');

async function cmd(event, api) {
  const cmdFolderPath = path.join(__dirname, '.');

  fs.readdir(cmdFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    const commandFiles = files.filter(file => path.extname(file).toLowerCase() === '.js');
    const commandList = commandFiles.map(file => path.parse(file).name);

    const perPage = 10;
    const totalPages = Math.ceil(commandList.length / perPage);

    const userMessage = event.body.toLowerCase().trim();
    let page = parseInt(userMessage.split(' ')[1]) || 1;
    let showAll = false;

    // Check if the user wants to see all commands
    if (userMessage.includes('-الكل')) {
      showAll = true;
      page = 1; // Reset the page number to 1 when showing all commands
    }

    if (showAll) {
      const formattedDate = moment().tz('Africa/Casablanca').format('DD/MM/YY, hh:mm:ss A');

      const images = [
        'https://i.imgur.com/8P0eUD3.jpg',
        'https://i.imgur.com/TusPebR.jpg',
        'https://i.imgur.com/EL7ZL5U.jpg',
        'https://i.imgur.com/IipU8MM.jpg',
        'https://i.imgur.com/OwuGwSq.jpg',
        'https://i.imgur.com/86MgzXI.jpg',
        'https://i.imgur.com/DqBEB54.jpg',
        'https://i.imgur.com/DkPSyZJ.jpg',
        'https://i.imgur.com/H285XQg.jpg',
      ];

      const output = [
        `┌─[ 🅘🅣🅐🅢🅗🅘 ${formattedDate} ]`,
        '╔═════════ஜ۩۞۩ஜ══════════╗',

        '│ ┌─[ قـٰ̲ـہاٰئمـٰ̲ـہة اٰلـٰ̲ـہأوٰاٰمـٰ̲ـہرٰ 🔥“ ]',
        '│ │',
        ...commandList.map(cmd => `│ ├─[ ${cmd.charAt(0).toUpperCase() + cmd.slice(1)} ]`),
        '│ │',
        '│ └─[ ڪل اࠗلأ୨واࠗمࣩــرၺ ♚ ]',
        '═══════════ஜ۩۞۩ஜ════════════',
        '',
        '',
        `إجمالي عدد الأوامر : ${commandList.length}`,
        ' ✅ | تم إعداد قائمة الأوامر بنجاح.',
        '',
        ' ⚠️ | تعليمات: من أجل أن ترى كيفية استخدام أمر محدد، قم بكتابة الأمر متبوعًا ب "-مساعدة." على سبيل المثال، لتعرف كيفية استخدام الأمر "تحصيل_الملف"، أكتب "تحصيل_الملف -مساعدة."',

        '╚═════════ஜ۩۞۩ஜ══════════╝',

      ];

      api.sendMessage({
        body: output.join('\n'),
        attachment: images.map(img => fs.createReadStream(img)),
      }, event.threadID);
    } else {
      page = Math.max(1, Math.min(page, totalPages));

      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, commandList.length);

      const commandsToShow = commandList.slice(startIndex, endIndex);

      const formattedDate = moment().tz('Africa/Casablanca').format('DD/MM/YY, hh:mm:ss A');

      const output = [
        `|--[ 🅘🅣🅐🅢🅗🅘 ]--|\n [تاريخ اليوم : ${formattedDate} ]`,
        '╔═════════ஜ۩۞۩ஜ══════════╗',

        '│ ┌─[ قـ๋ــ҉ैॣـــآئمة آلأوآمر 🧿❥˓ ]',
        '│ │',
        ...commandsToShow.map(cmd => `│ ├─[ ${cmd.charAt(0).toUpperCase() + cmd.slice(1)} ]`),
        '│ │',
        `│ └─[ ص֓ــف֛ـــحٟــٰـُ͢ـُٰــ͒͜ـًة ➤🌝₎ ${page} ]`,
        '═══════════ஜ۩۞۩ஜ════════════',
        '',
        `إجمالي عدد الأوامر: ${commandList.length}`,
        `ص֓ــف֛ـــحٟــٰـُ͢ـُٰــ͒͜ـًة ➤🌝₎ ${page}/${totalPages}`,
        '',
        '⚠️ | تعليمات: من أجل أن ترى كيفية استخدام أمر محدد، قم بكتابة الأمر متبوعًا بـ "-مساعدة." على سبيل المثال، لتعرف كيفية استخدام الأمر "تحصيل_الملف"، أكتب "تحصيل_الملف -مساعدة."',
        ...images.map(img => `│ ├─[ ${img} ]`),
      ];

      api.sendMessage({
        body: output.join('\n'),
        attachment: images.map(img => fs.createReadStream(img)),
      }, event.threadID);
    }
  });
}

module.exports = cmd;
