const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {
	prefix,
	token,
} = require('./config.json');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Connecting to Discord
client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

const servers = [];

function getServer(message) {
	for(const server of servers) {
		if (server.guild.id === message.channel.guild.id) {
			return server;
		}
	}
	const configFileName = './server_configs/' + message.channel.guild.name + '_config.json';
	const server = {
		guild: message.channel.guild,
		dispatcher: null,
		timeoutLeave: undefined,
		timeout: 30,
		configFileName: () => {
			return configFileName;
		},
		getConfig: () => {
			let configFile = '{}';
			try {
				configFile = fs.readFileSync(configFileName);
			}
			catch (e) {
				configFile = '{"volume": 100},"timeout":30}';
			}
			return JSON.parse(configFile);
		},
		saveConfig: (config) => {
			fs.writeFileSync(configFileName, JSON.stringify(config));
		},
	};
	server.timeout = server.getConfig().timeout;
	servers.push(server);
}

client.on('message', async message => {
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);
	const server = getServer(message);
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	try {
		if(commandName == 'ban' || commandName == 'userinfo') {
			command.execute(message, client);
		}
		else {
			command.execute(message, server);
		}
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});


client.login(token);
