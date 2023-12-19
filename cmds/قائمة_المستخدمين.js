const fs = require('fs');
const path = require('path');

async function countBotUsers(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.length > 1 && input[1] === '-مساعدة') {
    const usage = 'كيفية الإستخدام : قائمة_المستخدمين\n\n' +
      'الوصف: يحسب عدد مستخدمي الروبوت بناءً على ملفات appstate المخزنة.\n\n' +
      'مثال: قائمة_المستخدمين\n\n' +
      'ملاحظة: يقرأ هذا الأمر ملفات appstate المخزنة في مجلد معين ويحسب عدد مستخدمي الروبوت.';
    api.sendMessage(usage, event.threadID);
    return;
  }

  const appstateFolderPath = path.join(__dirname, '..', '0x3', 'credentials', 'cookies');

  fs.readdir(appstateFolderPath, async (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    const appStates = files.filter(file => path.extname(file).toLowerCase() === '.json');

    const botUsers = [];

    for (const appState of appStates) {
      const appStateData = JSON.parse(fs.readFileSync(path.join(appstateFolderPath, appState), 'utf8'));

      try {
        const c_userCookie = appStateData.find(cookie => cookie.key === 'c_user');

        if (c_userCookie) {
          const uid = c_userCookie.value;
          const userInfo = await api.getUserInfo(uid);

          if (userInfo && userInfo[uid]) {
            const name = userInfo[uid].name;
            botUsers.push({ name, uid });
          } 
        }
      } catch (error) {
        console.error('Error retrieving user info:', error);
      }
    }

    const totalBotUsers = botUsers.length;
    let message = 'عدد المستخدمين\n\n';
    for (const user of botUsers) {
      message += `الإسم: ${user.name}\nآيدي: ${user.uid}\n\n`;
    }
    message += `إجمالي عدد المستخدمين : ${totalBotUsers}`;

    await api.sendMessage(message, event.threadID);
  });
}

module.exports = countBotUsers;
