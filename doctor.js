var Discord = require("discord.js");
var config = require("./config");
var bot = new Discord.Client();
var fs = require('fs')

bot.on('error', e => { console.error(e); });

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
});

try {
    users = require("./data/user.json");
    users = JSON.parse(users);
} catch(e) {
	// No user faux-DB defined
	users = {};
}

var commands = {
  "ping": {
    name: "ping",
    process: function(bot, msg, arguments) {
      msg.channel.sendMessage(" " + msg.author + ", pong!");
      if (arguments) {
        msg.channel.sendMessage("note that !ping takes no arguments!");
      }
    }
  },
   "whoami": {
    name: "whoami",
    process: function(bot, msg, arguments) {
        // console.log(users)
        var id = msg.author.id
        console.log(users[id])
        if (users[id] === undefined) {
            console.log("I don't know who this is.");
            users[id] = {};
            users[id].name = msg.author.username + "#" + msg.author.discriminator;
        }
        else {
            console.log("This is " + users[id].name + "!")
        }
    }
  }   
}

bot.on("message", msg => {   
    let prefix = "!";
    if(msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;
    
    var order = msg.content.split(" ")[0].substring(1).toLowerCase()
    var arguments = msg.content.substring(order.length + 2); 
    var cmd = commands[order];
    if (cmd !== undefined) { 
        cmd.process(bot, msg, arguments);
        console.log(msg.author.username + " issued command: " + order); 
    }
});
bot.login(config.token);
