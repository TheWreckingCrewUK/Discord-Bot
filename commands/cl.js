var http = require('https');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'cl',
	aliases: ['clanlist', 'rank'],
	description: 'Find out how we\'re doing on ClanList.io',
	cooldown: 30,
	execute(message, args) {
		http.get('https://clanlist.io/ranking-data?page=&game_name=Arma%203', function (res) {
			var body = '';
			
			res.on('data', function (chunk) {
				body += chunk;
			});
			
			res.on('end', function() {
				var ret = JSON.parse(body);
				var results = "";
				var foundTWC = false;
				
				var i;
				for (i = 0; i < 3; i++) {
					if (ret.data[i].clantag == "TWC") { foundTWC = true; }
					results += (i + 1) + ". " + ret.data[i].title + " (" + (ret.data[i].total - 300) + " votes)\r\n";
				}
				
				if (foundTWC == false) {
					var rankings = ret.data;
					rankings.forEach(function (rank) {
						if (rank.clantag == "TWC") {
							results += (rank.rank) + ". " + rank.title + " (" + (rank.total - 300) + " votes)\r\n";
						}
					});
				}
				
				results += "\r\n [Please go and vote for us daily, it's quick and helps us tremendously.](https://clanlist.io/vote/TheWreckingCrew)";
				
				const embed = new MessageEmbed()
					.setColor('#CC4D00')
					.setTitle('Clanlist Ranking Results')
					.setDescription(results);
				
				message.channel.send({ embeds: [embed] });
			});
		}).on('error', function (e) {
			message.reply(`${e}`);
		});
	},
};