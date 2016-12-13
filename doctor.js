var Discord = require("discord.js");
var config = require("./config");
var bot = new Discord.Client();

var responseObject = {
  "ayy": "Ayy, lmao!",
  "wat": "Say what?",
  "lol": "roflmaotntpmp"
};

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
});

bot.on("message", msg => {   
    let prefix = "!";
    if(!msg.content.startsWith(prefix)) return;
    if(msg.author.bot) return;
    
    if(msg.content.startswith(prefix + responseObject[message.content])) {
        message.channel.sendMessage(responseObject[message.content]);
     }

    else if (msg.content.startsWith(prefix + "depart")) {
        bot.destroy();
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(config.token);
