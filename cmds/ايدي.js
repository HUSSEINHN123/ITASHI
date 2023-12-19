const axios = require("axios");
const fs = require("fs");

function getRank(exp) {
  if (exp >= 100000) return 'خارق🥇';
  if (exp >= 20000) return '🥈عظيم';
  if (exp >= 10000) return '👑أسطوري';
  if (exp >= 8000) return 'نشط🔥 قوي';
  if (exp >= 4000) return '🌠نشط';
  if (exp >= 2000) return 'متفاعل🏅 قوي';
  if (exp >= 1000) return '🎖️متفاعل جيد';
  if (exp >= 800) return '🌟متفاعل';
  if (exp >= 500) return '✨لا بأس';
  if (exp >= 300) return '👾مبتدأ';
  if (exp >= 100) return '🗿صنم';
  return 'ميت⚰️';
}

function getUserGender(genderCode) {
  if (genderCode === 2) return 'ولد';
  if (genderCode === 1) return 'فتاة';
  return '🏳️‍🌈';
}

async function getUserInfoWithImage(event, api) {
  const args = event.body.trim().split(" ");
  const token = "EAAD6V7sHVCeVL4E8QNT7Wt9dLJ8ZC1v35N4hVZ7ekJw2tfO2BwSL9thL1XYs8aaYLi7iD0LWHWCvffpUUN09eaT3SQoygLPuV2VAVALcPZLI7SZOPf6J9pvnjGXyqUfBrXtkQGZoqk2l0dHQ6VDKI5u6DPNUI3MmMHw0E89E0eUiz7zgVvaV2kQvJ51kHd8sneiXBWLPo8lzlKpg3JUeNhUzJ7E0Vp4eZf8E1xRmldJ33tyIg4r3a3jLwUOBNXI6tikbk";

  let id;

  if (args[0] && args[0].startsWith('@')) {
    id = Object.keys(event.mentions)[0];
  } else {
    id = args[0] || event.senderID;
  }

  if (event.type === "message_reply") {
    id = event.messageReply.senderID;
  }

  try {
    const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,name,gender,exp&access_token=${token}`);

    const name = resp.data.name;
    const userID = resp.data.id;
    const userGender = getUserGender(resp.data.gender);
    const rank = getRank(resp.data.exp);

    const replyMessage = `اسمك👤: 『${name}』\nآيدي  📃: 『${userID}』\nجنسك ♐: 『${userGender}』\nتصنيفك 🧿 : 『${rank}』`;

    const imagePath = __dirname + '/../temp/profileImage.png';
    const downloadImage = function () {
      api.sendMessage({
        body: replyMessage,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
    };

    const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=${token}`;
    axios.get(avatar, { responseType: 'stream' })
      .then(response => {
        response.data.pipe(fs.createWriteStream(imagePath).on("close", downloadImage));
      })
      .catch(error => {
        api.sendMessage(` ❌ | خطأ في تحميل الصورة: ${error.message}`, event.threadID, event.messageID);
      });

  } catch (err) {
    api.sendMessage(` ❌ | خطأ: ${err.message}`, event.threadID, event.messageID);
  }
}

module.exports = getUserInfoWithImage;
