const dotenv = require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const path = require("path");
const fs = require("fs");
const http = require("http");

let filesNames = [];
const directoryPath = path.join(__dirname, "assets");
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function (file) {
    filesNames.push(file);
  });
});

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
    case "!plsgame":
      var voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return console.error("Channel does not exist!");

      voiceChannel
        .join()
        .then(async (connection) => {
          try {
            play(voiceChannel, connection, "https://youtu.be/P-ciUlCLWM8", 0);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => console.log(err));
      break;
    case "!plsmath":
      var voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        voiceChannel = client.channels.cache.get("700758865893130260"); //asnee

      voiceChannel
        .join()
        .then(async (connection) => {
          try {
            play(voiceChannel, connection, "https://youtu.be/R07dzrNeHNU", 0);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => console.log(err));
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
  if (isMyBotOn && newMember.id !== "758674951321812992") {
    const newUserChannel = newMember.channelID;
    const oldUserChannel = oldMember.channelID;

    /*let greetingsUrl = "";
    switch (newMember.id) {
      case "305704741667602443": //kwas
        greetingsUrl = "https://youtu.be/dDnR-l6mQ9c";
        break;
      case "286129252787552256": //skorpiak
        greetingsUrl = "https://youtu.be/tC5MENXaGVs";
        break;
      case "305703298592145409": //gut
        greetingsUrl = "https://youtu.be/M2sFwA2sTAQ";
        break;
      case "259060553018769409": //wynta
        greetingsUrl = "https://youtu.be/MwAxBHVf8EM";
        break;
      case "305791906527445005": //frejn
        greetingsUrl = "https://youtu.be/lxZKGlUkJyo";
        break;
      case "369108237628473347": //ja
        greetingsUrl = "https://youtu.be/lxZKGlUkJyo";
        break;
      default:
        greetingsUrl = "https://youtu.be/yhgSV9OgPJQ";
        break;
    }*/

    const rndInt = Math.floor(Math.random() * (filesNames.length + 1));
    let audioUrl = "./assets/" + filesNames[rndInt];

    if (oldUserChannel !== newUserChannel && newUserChannel) {
      const channel = client.channels.cache.get(newUserChannel);
      if (!channel) return console.error("Channel does not exist!");

      channel
        .join()
        .then(async (connection) => {
          try {
            play(channel, connection, audioUrl, 0);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
});

const play = (channel, connection, audioUrl, repeated) => {
  const dispatcher = connection.play(audioUrl, { volume: 0.5 });

  /*dispatcher.on("error", (err) => {
    repeated = repeated || 0;
    if (repeated > 9) {
      channel.leave();
    } else play(channel, connection, broadcast, ++repeated);
    console.log(err);
  });*/

  dispatcher.on("finish", () => {
    channel.leave();
  });
};

client.login(process.env.BOT_TOKEN);
