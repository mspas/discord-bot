const dotenv = require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-type": "text/plain",
    });
    res.write("Hey");
    res.end();
  })
  .listen(4000 || process.env.PORT);

var isBotOn = [];

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  let text = message.content;
  switch (text) {
    case "!uncleon":
      message.channel.send(`Wujek przywita dla jego!`);
      setBotActivity(message.member.guild.id, true);
      break;
    case "!uncleoff":
      message.channel.send(`Wujek nie będzie witać!`);
      setBotActivity(message.member.guild.id, false);
      break;
    default:
      return true;
  }
});

const setBotActivity = (guildId, value) => {
  let found = false;

  for (let i = 0; i < isBotOn.length; i++) {
    const element = isBotOn[i];
    if (element.id === guildId) {
      element.value = value;
      found = true;
    }
  }

  if (!found) isBotOn.push({ id: guildId, value: value });
};

const checkIfBotIsOn = (guildId) => {
  for (let i = 0; i < isBotOn.length; i++) {
    const element = isBotOn[i];
    if (element.id === guildId) return element.value;
  }

  isBotOn.push({ id: guildId, value: true });
  return true;
};

client.on("voiceStateUpdate", (oldMember, newMember) => {
  let isMyBotOn = checkIfBotIsOn(newMember.guild.id);
  if (isMyBotOn) {
    const newUserChannel = newMember.channelID;
    const oldUserChannel = oldMember.channelID;

    const greetingsUrl =
      newMember.id === "305704741667602443"
        ? "https://youtu.be/dDnR-l6mQ9c"
        : "https://youtu.be/yhgSV9OgPJQ"; //kwas

    const video = ytdl(greetingsUrl);

    if (oldUserChannel !== newUserChannel && newUserChannel) {
      const channel = client.channels.cache.get(newUserChannel);
      if (!channel) return console.error("The channel does not exist!");
      channel
        .join()
        .then((connection) => {
          const dispatcher = connection.play(video, { volume: 1.0 });
          dispatcher.on("finish", () => {
            channel.leave();
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
});

client.login(process.env.BOT_TOKEN);

/*if (
  oldUserChannel !== newUserChannel &&
  (newUserChannel === "700758865893130260" ||
    newUserChannel === "377511754760192001" ||
    newUserChannel === "378644418686877698")
) */

//if (oldUserChannel !== newUserChannel && newUserChannel === "758673613095174189")
