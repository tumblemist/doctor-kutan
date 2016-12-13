var Discord = require("discord.js");
var config = require("./config");
var bot = new Discord.Client();

bot.on("message", msg => {
    if (msg.content.startsWith("ping")) {
      msg.channel.sendMessage("pong!");
    } 

    else if (msg.content.startsWith("depart")) {
      bot.destroy();
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(config.token);
