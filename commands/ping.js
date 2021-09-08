module.exports = {
	name: 'ping',
	aliases: ['up'],
	description: 'Check if the bot is responding',
	cooldown: 5,
	roles: ["Management", "Dev"],
	execute(message, args) {
		message.channel.send({ content: 'I\'m alive.' });
	},
};