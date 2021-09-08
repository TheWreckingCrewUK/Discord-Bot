const Gamedig = require('gamedig');
const { MessageAttachment, MessageEmbed } = require('discord.js');

var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');

/* function objToString (obj) {
	var str = '';
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			str += p + '::' + obj[p] + '\n';
		}
	}
	return str;
} */

// from stack overflow
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	name: 'public_test',
	aliases: ['pt'],
	description: 'Test embed idea for public session report thing - to be automated',
	cooldown: 1,
	roles: ["Management", "Dev"],
	execute(message, args) {
		Gamedig.query({
			type: 'arma3',
			host: 'alpha.twcrew.eu'
		}).then((state) => {
			// This needs to be cleaned up and co-ordinated with Rik
			var map = capitalizeFirstLetter(state.map);
			var displayString = state.raw.game.split('_');
			var gameMode = displayString[0]; 
			
			map = gameMode + " on " + map;
			//var output = objToString(state);
			//message.channel.send("RAW: " + output);
			
			var canvas = Canvas.createCanvas(500, 125);
			var ctx = canvas.getContext('2d');
			
			var Image = Canvas.Image;
			var img = new Image();
			
			// TOOD: make dynamic based upon map w/ fallback?
			img.src = './backdrops/ruha.jpg';
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			ctx.fillStyle = 'white';
			ctx.textAlign = 'left';
			ctx.strokeStyle = 'black';
			
			ctx.shadowColor = "black";
			ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 5;
			ctx.shadowBlur = 20;

			ctx.font = '26pt PTSans-Bold'
			
			if (args.length == 0) {
				if (map == "Arma 3") { map = "Selecting a map..."; }
				ctx.strokeText(map, 10, 90);
				ctx.fillText(map, 10, 90);
			} else {
				var string = args.join(' ');
				if (string == "Arma 3") { string = "Selecting a map..."; }
				ctx.strokeText(string, 10, 90);
				ctx.fillText(string, 10, 90);
			}
			
			ctx.font = '14pt PTSans-Regular';
			ctx.strokeText("There's currently " + state.players.length + " players online", 10, 113);
			ctx.fillText("There's currently " + state.players.length + " players online", 10, 113);
			
			canvas.createJPEGStream().pipe(fs.createWriteStream('./output/temp.jpg'));
			
			var authorString = 'No-one is on public at the moment';
			var titleString = 'Want to get a session going?';
			
			if (state.players.length > 0) {
				authorString = 'There\'s a public session on-going';
				titleString = 'Interested in joining?';
			}
			
			const file = new MessageAttachment('./output/temp.jpg');
			const embed = new MessageEmbed()
				.setColor('#CC4D00')
				.setAuthor(authorString, '', 'http://thewreckingcrew.eu')
				.setThumbnail('http://i.imgur.com/kpgViQ9.png')
				.setImage("attachment://temp.jpg")
				.setTitle(titleString)
				.setDescription('[Install Guide](http://www.thewreckingcrew.eu/418684/topic/twc-public-installation-guide-ijq) // [Connect to TS](http://h555.pw/ts3_redirect)')
				.setFooter('Send a message to @Recruiters if you\'re having trouble connecting!');
			
			message.channel.send({ embeds: [embed], files: [file] });
		}).catch((error) => {
			message.channel.send({ content: "Server is offline" });
		});
	},
};