const dotenv = require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }
});

client.on("voiceStateUpdate", (oldMember, newMember) => {
  const newUserChannel = newMember.channelID;
  const oldUserChannel = oldMember.channelID;

  if (newUserChannel === "758673613095174189") {
    const channel = client.channels.cache.get(newUserChannel);
    if (!channel) return console.error("The channel does not exist!");
    channel
      .join()
      .then((connection) => {
        const dispatcher = new Promise((resolve, reject) => {
          connection.play("./witam.mp3");
          setTimeout(() => resolve("done"), 8000);
        }).then(() => {
          channel.leave();
        });
      })
      .catch((e) => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
  } else if (
    oldUserChannel === "758673613095174189" &&
    newUserChannel !== "758673613095174189"
  ) {
    console.log(`has left the channel`);
  }
});

client.login(process.env.BOT_TOKEN);
