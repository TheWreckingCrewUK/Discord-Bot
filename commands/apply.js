// http://i.imgur.com/kpgViQ9.png - logo

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'apply',
	aliases: ['join'],
	description: 'Handy helper for those interested in joining',
	cooldown: 0,
	execute(message, args) {
		const embed = new MessageEmbed()
			.setColor('#CC4D00')
			.setTitle('Joining Us')
			.setDescription('If you are interested in joining our private events, or to get involved with the community in different ways, you can send an application in. It is a very short form, and usually approved quite quickly. In order to apply, you will need a website account. The application form can be found [here](http://www.thewreckingcrew.eu/recruitment/169056). We look forward to seeing you around! There are a few requirements, type !required to find what they are.')
			.addField('You can reach out to us on:', '[TeamSpeak](http://h555.pw/ts3_redirect)', true)
			.addField('\u200B', '[The Forums/Site](http://www.thewreckingcrew.eu/)', true)
			.setThumbnail('http://i.imgur.com/kpgViQ9.png')
		
		message.channel.send({ embeds: [embed] });
	},
};