// http://i.imgur.com/kpgViQ9.png - logo url

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'required',
	aliases: ['requirements'],
	description: 'What is required in order to participate',
	cooldown: 0,
	execute(message, args) {
		const embed = new MessageEmbed()
			.setColor('#CC4D00')
			.setTitle('Requirements')
			.setDescription('In order to maintain our immersive play style, and to deliver the best possible gaming/community experience, we have a few requirements of all participants.\n\n* You need to be age 14 and above \n* You need a legal copy of Arma 3, apex is optional \n* You need a working microphone, that you are willing to use \n* You need to be willing to abide by our rules, and expect others to do so too')
			.setThumbnail('http://i.imgur.com/kpgViQ9.png')
		
		message.channel.send({ embeds: [embed] });
	},
};