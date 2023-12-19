async function thread(event, api) {
  const input = event.body.toLowerCase().trim();
  const threadID = event.threadID;
  
  if (input === 'مجموعة') {
    api.getThreadInfo(threadID, (err, info) => {
      if (err) return console.error(err);
      
      const message = {
        body: `آيدي المجموعة: ${info.threadID}\nإسم المجموعة: ${info.threadName}`,
      };
      api.sendMessage(message, threadID);
    });
  } else if (input === 'مجموعة -قائمة') {
    api.getThreadList(500, null, ["INBOX"], (err, list) => {
      if (err) return console.error(err);
      
      list = list.filter(thread => thread.isGroup); 
      list.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name); 
        } else {
          return 0;
        }
      });
  
      let threads = "جميع المجموعات التي ينتمي إليها إيتاشي البوت :\n\n";
      for (let i = 0; i < list.length; i++) {
        threads += `المجموعة ${i + 1}: ${list[i].name}\nآيدي المجموعة: ${list[i].threadID}\n\n`;
      }
      
      api.sendMessage(threads, threadID);
    });
  } else if (input === 'مجموعة -مساعدة') {
    const message = {
      body: `كيفية الإستخدام: المجموعة\nمثال: المجموعة\nالوصف: يريك المجموعة الحالية.\n\n` +
        `كيفية الإستخدام: مجموعة -قائمة\nمثال: مجموعة -قائمة\nالوصف: يريك كل المجموعات اللتي يتواجد بها البوت.\n\n` +
        `كيفية الإستخدام: مجموعة -مساعدة\nمثال: مجموعة -مساعدة\nالوصف: يريك الوصف و كيفية إستعمال الأمر .`
    };
    api.sendMessage(message, threadID);
  }
}

module.exports = thread;
