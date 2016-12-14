var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require('fs')

var config = require("./config.json");
var items = require("./db/items.json");

bot.on('error', e => { console.error(e); });

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
});

try {
    users = require("./data/users.json");
} catch(e) {
	// No user faux-DB defined
	users = {};
}

var commands = {
  "ping": {
    name: "ping",
    process: function(bot, msg, arguments) {
      var text = msg.author + ", pong!"
      // msg.channel.sendMessage(" " + msg.author + ", pong!");
      if (arguments) {
        text += " (Note that !ping takes no arguments.)";
      }
      msg.channel.sendMessage(text);
    }
  },
   "id": {
    name: "id",
    process: function(bot, msg, arguments) {
        if (arguments.split(" ").length > 1) { arguments = arguments.split(" ")[0] }
        var id = msg.author.id
        if (users[id] === undefined) {
            console.log("I don't know who this is. Adding.");
            users[id] = {};
            users[id].name = msg.author.username + "#" + msg.author.discriminator;
            var json = JSON.stringify(users);
            fs.writeFileSync('./data/users.json', json, 'utf8')
        }
	if (arguments == '') { 
            if (users[id].ffrk === undefined) {
                msg.channel.sendMessage("You haven't given me an FFRK ID, " + msg.author + ".");
            }
            else {
                msg.channel.sendMessage(msg.author + "'s FFRK ID is **" + users[id].ffrk + "**.");
            } 
        }
        else if (msg.mentions.users.first() !== undefined) {
            let they = msg.mentions.users.first()
            if (users[they.id] === undefined) {
                console.log("I don't know who this is. Adding.");
                users[they.id] = {};
                users[they.id].name = they.username + "#" + they.discriminator;
                var json = JSON.stringify(users);
                fs.writeFileSync('./data/users.json', json, 'utf8')
            }
            if (users[they.id].ffrk === undefined) {
                msg.channel.sendMessage(they + " has not given me an FFRK ID.");
            }
            else {
                msg.channel.sendMessage(they + "'s FFRK ID is **" + users[they.id].ffrk + "**.");
            }
        }
        else { 
            if (arguments.match(/^[a-zA-Z0-9]{4}$/) !== null) {
                users[id].ffrk = arguments.match(/^[a-zA-Z0-9]{4}$/)[0]
                msg.channel.sendMessage(msg.author + "'s FFRK ID is now set to **" + users[id].ffrk + "**.");
                let json = JSON.stringify(users);
                fs.writeFileSync('./data/users.json', json, 'utf8')
            }
            else { msg.channel.sendMessage(msg.author + ", this is not a valid code."); }
            // console.log(arguments.match(/^[a-zA-Z0-9]{4}$/))
        }
    }
  },
  "item": {
    name: "item",
    process: function(bot, msg, arguments) {
      var text = ""
      // text += msg.author + ", let's try searching for items."
      if (arguments == '') {
          text += "In order to search for an item, you have to provide me with an item name.";
          msg.channel.sendMessage(text);
          return;
      }

      var realms = { "1" : "I", "2" : "II", "3" : "III", "4" : "IV", "5" : "V",
      "6" : "VI", "7" : "VII", "8" : "VIII", "9" : "IX", "10" : "X", "11" : "XI",
      "12" : "XII", "13" : "XIII", "14" : "XIV", "15" : "XV", "T": "FFT", "C": "Core",
      "B": "Beyond"
      }
      var syn = ''
      if (arguments.match(/\s([iIvVxXtTcCbB0-9]*?)$/) !== null) { syn = arguments.match(/\s([iIvVxXtTcCbB0-9]*?)$/)[1].toUpperCase() }
      console.log(syn)
      if (syn !== '') { var input = arguments.substring(0, (arguments.length-(syn.length+1))) }
      else { var input = arguments }
      if (realms[syn] !== undefined) { syn = realms[syn] }
          
      var output = items.filter(function ( obj ) {
          return obj.name.toLowerCase() === input.toLowerCase();
        });

      if (syn !== '') {
      var realmoutput = output.filter(function ( obj ) {
          return obj.realm === syn;
        });
      }
      if (realmoutput !== undefined) { output = realmoutput }
      if (output.length <= 0) {
          text += "I can't find anything like that, kupo."
          msg.channel.sendMessage(text);
          return;
      }
      if (output.length > 1) { 
          text += "I found more than one item, kupo. Did you mean:"
          for (i = 0; i < output.length; i++) {
              text += "\n" + output[i].name + " (" + output[i].realm + ")"
          }
      }
      else {
          console.log(output)
          try {
              text += "**" + output[0].name + " (" + output[0].realm + ") [" + output[0].brar + "★ " + output[0].type
              if (output[0].character !== undefined) { text += ", " + output[0].character }
              text += "]**"
              text += "\nLv" + output[0].blv + ": "
              var stats = [ "atk", "def", "mag", "res", "mnd", "acc", "eva" ]
              var count = 0
              for (j = 0; j < stats.length; j++) {
                  if (output[0][stats[j]] !== undefined && output[0][stats[j]] > 0) {
                       if (count > 0) { text += ", " }
                       text += output[0][stats[j]] + " " + stats[j].toUpperCase();
                       count++;
                       }
                  }
              var bstats = ["batk", "bdef", "bmag", "bres", "bmnd", "bacc", "beva"]
              var mstats = ["matk", "mdef", "mmag", "mres", "mmnd", "macc", "meva"]
              var clvl = output[0].blv + (output[0].brar * 10)
          } catch(e) {
              text += "Something went wrong, kupo."
          }
      }  
      msg.channel.sendMessage(text);
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
