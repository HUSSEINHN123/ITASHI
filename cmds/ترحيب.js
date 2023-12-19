const fs = require("fs");
const path = require("path");

// This function handles the event when someone enters a new group
function handleGroupEntry(api, event) {
  // Get the user info for the person who entered the group
  const userInfo = await api.getUserInfo(event.senderID);

  // Create a message object with the user's name and a sample image attachment
  const message = {
    body: `أهلا يا, ${userInfo[event.senderID].name}!\nأتمنى أن تستمتع بإقامتك معنا\nإستمتع 😎`,
    attachment: [
      fs.createReadStream(path.join(__dirname, "path_to_image.jpg"))
    ]
  };

  // Send the message to the group
  api.sendMessage(message, event.threadID, (err) => {
    if (err) {
      console.error("Failed to send message:", err);
    }
  });
}

module.exports = handleGroupEntry;