module.exports = {
	name: 'count',
	description: 'discord member count',
	cooldown: 30,
	roles: ["Management", "Dev"],
	execute(message, args) {
		message.reply("there's currently " + message.guild.memberCount + " members");
	},
};