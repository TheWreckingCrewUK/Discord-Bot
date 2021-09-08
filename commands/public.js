const Gamedig = require('gamedig');
const { MessageEmbed } = require('discord.js');

/* function objToString (obj) {
	var str = '';
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			str += p + '::' + obj[p] + '\n';
		}
	}
	return str;
} */

// There's an image version of this command under !pt
module.exports = {
	name: 'public',
	aliases: ['pub'],
	description: 'Management Command',
	cooldown: 1,
	roles: ["Management", "Dev"],
	execute(message, args) {
		Gamedig.query({
			type: 'arma3',
			host: 'alpha.twcrew.eu'
		}).then((state) => {
			var map = state.raw.game;
			map = map.replace(/_/g, ' ');
			//var output = objToString(state.raw);
			//message.channel.send("RAW: " + output);
			
			const embed = new MessageEmbed()
				.setColor('#CC4D00')
				.setTitle(map)
				.setDescription("There's currently " + state.players.length + " players online.")
				.addField('How to connect?', '[Install Guide](http://www.thewreckingcrew.eu/418684/topic/twc-public-installation-guide-ijq)', true)
				.addField('\u200B', '[Connect to TS](http://h555.pw/ts3_redirect)', true)
				.setThumbnail('http://i.imgur.com/kpgViQ9.png');
			
			message.channel.send({ embeds: [embed] });
		}).catch((error) => {
			//message.channel.send("Server is offline");
			//message.channel.send(error.toString());
			message.channel.send({ content: error.toString(), split: true });
		});
	},
};