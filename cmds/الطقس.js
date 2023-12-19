const WeatherJS = require("weather-js");

async function weather(event, api) {
  const data = event.body.split(" ");
  if (data.length > 1 && data[1] === "-مساعدة") {
    const usage = "كيفية الإستخدام: الطقس [إسم المدينة]\n\n" +
      "الوصف : يقوم بجلب معلومات حول حالة الحو في مدينة معينة.\n\n" +
      "مقال: الطقس لندن\n\n" +
      "ملاحظة ⚠️: يتم عرض درجة الحرارة بالدرجة المئوية، والتنبؤات للأيام الخمسة القادمة.";
    api.sendMessage(usage, event.threadID);
    return;
  }
  if (data.length < 2) {
    const usage = " ⚠️ | أرجوك قم بإدخال إسم المدينة هكذا\nالطقس الدار البيضاء";
    api.sendMessage(usage, event.threadID);
  } else {
    data.shift();
    const location = data.join(" ");
    WeatherJS.find(
      {
        search: location,
        degreeType: "C",
      },
      (err, result) => {
        if (err) {
          api.sendMessage(" ❌ |حدث خطأ أثناء جلب بيانات الطقس.", event.threadID);
          return;
        }
        if (result.length === 0) {
          api.sendMessage(` ❗ | لم يتم إيجاد أي نتائج ل "${location}". الرجاء إدخال اسم صالح للمدينة أو الموقع.`, event.threadID);
          return;
        }
        const weatherData = result[0];
        const message = `الطقس من أجل ${weatherData.location.name} (${weatherData.location.lat}, ${weatherData.location.long}):\n\n` +
          `الحرارة 💥: ${weatherData.current.temperature}°C / ${(weatherData.current.temperature * 9) / 5 + 32}°F\n` +
          `السماء 🌌: ${weatherData.current.skytext}\n` +
          `أشعر و كأنها 🌝: ${weatherData.current.feelslike}\n` +
          `الرطوبة 💦: ${weatherData.current.humidity}\n` +
          `سرعة الرياح 🌪️: ${weatherData.current.winddisplay}\n\n` +
          `تنبؤ بالمناخ 🧿\n` +
          `الإثنين: ${weatherData.forecast[0].skytextday}\n` +
          `الثلاثاء: ${weatherData.forecast[1].skytextday}\n` +
          `الأربعاء: ${weatherData.forecast[2].skytextday}\n` +
          `الخميس: ${weatherData.forecast[3].skytextday}\n` +
          `الجمعة: ${weatherData.forecast[4].skytextday}\n`;
        api.sendMessage(message, event.threadID);
      }
    );
  }
}

module.exports = weather;
