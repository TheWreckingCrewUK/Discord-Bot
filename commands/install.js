// http://i.imgur.com/kpgViQ9.png - logo

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'install',
	aliases: ['dl', 'download', 'guide', 'public'],
	description: 'Grab a quick link to the installation guide',
	cooldown: 0,
	execute(message, args) {
		const embed = new MessageEmbed()
			.setColor('#CC4D00')
			.setTitle('Public Installation Guide')
			.setDescription('We\'ve created a handy guide in helping you get on our public server as quickly and as easily as possible, that you can find [here](http://www.thewreckingcrew.eu/418684/topic/twc-public-installation-guide-ijq). If you have any questions, please ask away, we\'re more than happy to help!')
			.addField('You can reach out to us on:', '[TeamSpeak](http://h555.pw/ts3_redirect)', true)
			.addField('\u200B', '[The Forums/Site](http://www.thewreckingcrew.eu/)', true)
			.setThumbnail('http://i.imgur.com/kpgViQ9.png');
		
		message.channel.send({ embeds: [embed] });
	},
};