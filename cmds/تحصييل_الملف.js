const fs = require('fs');
const https = require('https');
const path = require('path');
const google = require("googlethis");

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const FILE_SEND_DELAY = 5000; 

async function fileSearch(query, fileType) {
  let result = await google.search(query + " " + fileType, {
    safe: true,
  });
  return result;
}

async function getFile(event, api) {
  const input = event.body.toLowerCase();
  const data = input.split(" ");

  if (data.length > 1 && data[1] === '-مساعدة') {
    const usage = "كيفية الإستخدام: تحصييل_الملف [نوع الملف] [إستعلام البحث]\n\n" +
      "الوصف : يقوم بإجراء بحث عن ملف على الويب بناءً على نوع الملف المحدد واستعلام البحث.\n\n" +
      "مثال: تحصييل_الملف pdf openai documentation\n\n" +
      "ملاحظة ⚠️: سيقوم الأمر بتنزيل الملف المطابق الأول الذي تم العثور عليه وإرساله كمرفق.";
    api.sendMessage(usage, event.threadID);
    return;
  }

  if (data.length < 3) {
    api.sendMessage(`تنسيق الأمر غير صالح. كيفية الإستخدام : تحصييل_الملف [نوع الملف] [إستعلام البحث]`, event.threadID, event.messageID);
  } else {
    let fileType = data[1];
    data.shift();
    data.shift();
    let query = data.join(" ");
    api.sendMessage(`⏳ | يرجى الإنتظار لمدة 5 ثوان بينما يقوم النظام بإجراء بحث عن الملفات.`, event.threadID, event.messageID);
    (async () => {
      let searchResult = await fileSearch(query, fileType).catch((e) => {
        console.log(e);
        return null;
      });
      if (searchResult) {
        let results = searchResult.results;
        let found = false;
        let count = 0;
        for (let i = 0; i < results.length; i++) {
          let title = results[i].title.replace(/[\\/:"*?<>|]/gi, "_"); 
          if (results[i] !== undefined && results[i].url.includes("." + fileType)) {
            let file = fs.createWriteStream(path.join(__dirname, '../temp/', title + '.' + fileType));
            let name = `${__dirname}/../temp/${title}.${fileType}`; 
            try {
              found = true;
              count++;
              https.get(results[i].url, { rejectUnauthorized: false }, (r) => {
                r.pipe(file);
                file.on("finish", () => {
                  fs.stat(name, (err, stats) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    if (stats.size > MAX_FILE_SIZE) {
                      api.sendMessage({
                        body: ` ✨ |الملف كبير جدا ليتم إرساله هنا في المسنجر تفضل إليك الرابط: ${results[i].url}`
                      }, event.threadID, event.messageID);
                      if (fs.existsSync(name)) {
                        fs.unlink(name, console.error);
                      }
                    } else {
                      if (count === 1) {
                        api.sendMessage(` ✅ | الملف ${fileType} لقد تم إيجاده`, event.threadID, event.messageID);
                      }
                      setTimeout(() => {
                        api.sendMessage({
                          body: ` ✅ | هاهو ذا الملف  ${fileType} \n\nالعنوان : ${results[i].title}\nالرابط : ${results[i].url}`,
                          attachment: fs.createReadStream(name).on("end", () => {
                            if (fs.existsSync(name)) {
                              fs.unlink(name, (err) => {
                                if (err) return console.error(`Error [${fileType}]: ` + err);
                                if (count === results.length) {
                                  api.setMessageReaction("✅", event.messageID, (err) => { }, true);
                                }
                              });
                            }
                          }),
                        },
                          event.threadID,
                          event.messageID
                        );
                      }, FILE_SEND_DELAY * i);
                    }
                  });
                });
              });
            } catch (e) {
              if (fs.existsSync(name)) {
                fs.unlink(name, (err) => {
                  if (err) return console.error(`Error [${fileType}]: ` + err);
                });
              }
              found = false;
            }
          }
        }
        if (found) {
          api.sendMessage(` ✅ |تم الإنتهاء من البحث و تم إيحادغ ${count} ${fileType} ملف.`, event.threadID, event.messageID);
        } else {
          api.sendMessage(`[❗]لا أستطيع إيجاد الملف ${fileType}.`, event.threadID, event.messageID);
        }
      } else {
        api.sendMessage("[❗]عذرًا، حدث خطأ أثناء معالجة طلبك. الرجاء معاودة المحاولة في وقت لاحق.", event.threadID, event.messageID);
      }
    })();
  }
}

module.exports = getFile;
