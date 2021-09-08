const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { prefix, token, host, user, password, database, guildId } = require('./config.json');

var mysql = require('mysql');
// lazy ez implementation - need to do sharding to handle dc properly in future
// currently just crashes the bot on db dc and the service monitor restarts it
var connection = mysql.createConnection({ host: host, user: user, password: password, database: database, charset : 'utf8mb4' });

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Collection();

client.once('ready', () => {
	console.log('Connected...');
	
	// Print to bot-debug channel that it's connected (pm2 restarts the service on it erroring out/file change)
	const channel = client.channels.cache.get('525786570146709524');
	channel.send(`Bot has reconnected, either due to losing connection or script restart (updated) ...`);
});

// Remove deleted messages from the chatbox display
client.on('messageDelete', function(message, channel){
	if (message.channel.name == "public-discussion") {
		connection.query('DELETE FROM discord_messages WHERE snowflake = ?', message.id, function (error, results, fields) {
			if (error) { console.error(error); };
		});
	}
});

client.on('message', message => {
	//console.log("#" + message.channel.name + " - " + message.author.username + ": " + message.cleanContent);
	
	// Add to the DB public discussion messages, for displaying on the site 'chatbox'
	if (message.channel.name == "public-discussion") {
		if (message.type == "GUILD_MEMBER_JOIN") {
			var post = {username: message.member.displayName, hexcode: "#FFFFFF", msg: "_Joined the Discord server_", snowflake: message.id};
			connection.query('INSERT INTO discord_messages SET ?', post, function (error, results, fields) {
				if (error) { console.error(error); };
			});
		} else {
			var hex = message.member.displayHexColor;
			if (hex == "#000000") { hex = "#ffffff"; } // override default colour for site display
			var post = {username: message.member.displayName, hexcode: hex, msg: message.cleanContent, snowflake: message.id};
			connection.query('INSERT INTO discord_messages SET ?', post, function (error, results, fields) {
				if (error) { console.error(error); };
			});
		}
	}
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// sanitize chat command and see if we can find something that matches
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase()

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.roles) {
		if (!command.roles.some(r => message.member.roles.cache.find(i => i.name === r))) {
			return message.reply(`You don't have access to that command, sorry!`);
		}
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	try {
		command.execute(message, args);
	} catch (error) {
		console.log(error);
		message.reply('there was an error trying to execute that command! <@98408323644133376>');
	}
});

/** 
 * Notify recruiters upon someone joining/leaving the Discord, and log it to a basic database table
 * event_id: 0 = joined, 1 = left
 * table structure has a default timestamp col auto-filled in
 */
client.on("guildMemberAdd", (member) => {
	// recruiters channel
	const channel = client.channels.cache.get('525996718345551872');
	channel.send(`<@&371662934335815680> ${member.user} has joined`);
	
	var post = {user_id: member.id, event_id: 0};
	connection.query('INSERT INTO discord_user_history SET ?', post, function (error, results, fields) {
		if (error) { console.error(error); };
		console.log("User joining added to DB");
	});
});

client.on("guildMemberRemove", (member) => {
	const channel = client.channels.cache.get('525996718345551872');
	channel.send(`<@&371662934335815680> ${member.user} has left (or been removed)`);
	
	var post = {user_id: member.id, event_id: 1};
	connection.query('INSERT INTO discord_user_history SET ?', post, function (error, results, fields) {
		if (error) { console.error(error); };
		console.log("User leaving added to DB");
	});
});

/**
 * Slash Commnads
 * Basic toggle of role group at the moment - if expanded upon, rewrite to match the message style commands
 * Can send messages that only display to the person using the command - maybe nice to utilise.
 */
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'public') {
		// TODO: this should be cleaned up...
		const role = interaction.guild.roles.cache.get('770571130762559508');
		
		if (interaction.member.roles.cache.some(r => r.name == 'Public Players')) {
			interaction.member.roles.remove(role);
			await interaction.reply(`${interaction.user} has been removed from the public server notifcation group.`);
		} else {
			interaction.member.roles.add(role);
			await interaction.reply(`${interaction.user} has been added to the public server notifcation group.`);
		}
	}
});


client.on("error", err => {
	console.log(err);
});

client.login(token);