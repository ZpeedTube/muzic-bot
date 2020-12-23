module.exports = {
	name: 'prefix',
	description: 'Change the default prefix',
	execute(message, server) {
		const args = message.content.split(' ');
		const prefix = args[1];

		const config = server.getConfig();
		config.prefix = prefix;
		server.prefix = prefix;
		server.saveConfig(config);

		const str = `Prefix is now **${prefix}**`;
		message.channel.send(str);
	},
};
