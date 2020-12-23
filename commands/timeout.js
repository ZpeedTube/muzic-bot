module.exports = {
	name: 'timeout',
	description: 'How long bot should wait before disconnecting vc (default 30 s)',
	execute(message, server) {
		const args = message.content.split(' ');
		let str = '';
		let timeout = parseInt(args[1], 10) || 30;
		if (timeout > 100) timeout = 100;
		if (timeout < 0) timeout = 0;

		if (server) {
			const config = server.getConfig();
			config.timeout = timeout;
			server.timeout = timeout;
			server.saveConfig(config);
			str = `Setting next timeout to ${timeout} secounds`;
		}
		else {
			str = 'Please start a song before seting timeout';
		}

		message.channel.send(str);
	},
};
