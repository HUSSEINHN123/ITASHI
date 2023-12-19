
async function createNewGroup(event, api) {
  const input = event.body.toLowerCase().split(' ');

  if (input.includes('-مساعدة')) {
    const usage = 'كيفية_الإستخدام: إنشاء_مجموعة [مشارك1] [مشارك2] ... -[إسم المجموعة]\n\n' +
      'الوصف: إنشاء محادثة جماعية جديدة مع المشاركين المحددين وعنوان المجموعة الاختياري.\n\n' +
      'مثال: إنشاء_مجموعة @المستخدم1 @المستخدم2 @المستخدم3 -مجموعة الأقوياء\n\n' +
      'ملاحظة ⚠️: يحب على الأعضاء أن تتم عمل منشن لهم "@منشن". إسم المجموعة يجب أن تبدأ ب شرطة "-" متبوعة بإسم المجموعة.';
    api.sendMessage(usage, event.threadID);
    return;
  }

  const mentions = event.mentions;
  const participantIDs = Object.keys(mentions);
  let groupTitle = '';

  const titleIndex = input.findIndex(word => word.startsWith('-'));
  if (titleIndex !== -1 && titleIndex < input.length) {
    groupTitle = input.slice(titleIndex).join(' ').substring(1);
  }

  if (participantIDs.length < 2) {
    api.sendMessage(' ⚠️ |تنسيق الأمر غير صالح. يجب أن يكون اثنين من الأعضاء على الأقل.', event.threadID);
    return;
  }

  const creatorID = event.senderID;
  participantIDs.push(creatorID);

  api.createNewGroup(participantIDs, groupTitle, async (err, threadID) => {
    if (err) {
      console.error('Error creating group chat:', err);
      api.sendMessage(' ❌ |فشل إنشاء المجموعة . الرجاء معاودة المحاولة في وقت لاحق.', event.threadID);
      return;
    }

    try {
      const changeAdminStatusAsync = (threadID, participantIDs) => {
        return new Promise((resolve, reject) => {
          api.changeAdminStatus(threadID, participantIDs, true, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };

      await changeAdminStatusAsync(threadID, participantIDs);
      
      api.getThreadInfo(threadID, (err, groupInfo) => {
        if (err) {
          console.error('Error getting group info:', err);
          api.sendMessage('تم إنشاء المجموعة بنجاح ✅. \nآيدي المجموعة : ' + threadID, event.threadID);
          return;
        }

        const groupName = groupTitle || groupInfo.name || 'بدون إسم';
        api.sendMessage('تم إنشاء المجموعة بنجاح ✅.\n إسم المجموعة : ' + groupName + ', آيدي المجموعة : ' + threadID, event.threadID);
      });
    } catch (error) {
      console.error('Error setting group admin:', error);
      api.sendMessage(' ✅ |تم إنشاء المجموعة الجديدة بنجاح،\n [⚠️ ]:  لكن حدث خطأ أثناء تعيينك كمسؤول المجموعة. يرجى الاتصال بمنشئ المجموعة ليحعلك مسؤولًا في المجموعة.', event.threadID);
    }
  });
}

module.exports = createNewGroup;

