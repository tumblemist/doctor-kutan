const { Command } = require('discord.js-commando');

module.exports = class IdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'id',
			aliases: ['id', 'code'],
			group: 'ffrk',
			memberName: 'id',
			description: 'Get the FFRK ID of someone.',
			args: [
				{
					key: 'ending',
					prompt: "Would you like to edit your ID, or look up someone else's?",
					validate: function (val, msg) {
						if (msg.mentions.users.first()) return true;
						else if (val.match(/^[A-Za-z0-9]{4}$/) !== null) return true;
						else return 'You need to provide a valid friend ID, or a person to look up.';
					},
					parse: val => val
				}
			]
		});
	}

	async run(msg, args) {
		const argument = args.ending;
		if (msg.mentions.users.first()) { 
			console.log("This is where we should look up that user.")
		}
		else if (argument.match(/^[A-Za-z0-9]{4}$/) !== null) { 
			console.log("This is where we add their friend code to the database.")
		}
		else { 
			console.log("What the fuck did you even do?")
			return null; /* Because something got really fucking broken! */ 
		}
		return msg.say(`What came after your command was ${argument}.`);
        }
};