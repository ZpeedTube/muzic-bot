module.exports = {
	name: 'volume',
	description: 'Change volume of music (0% to 100%)',
	execute(message, server) {
		const args = message.content.split(' ');
		let str = '';
		let volume = parseInt(args[1], 10) || 50;
		if (volume > 100) volume = 100;
		if (volume < 0) volume = 0;

		const config = server.getConfig();
		config.volume = volume;
		server.saveConfig(config);

		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		const dispatcher = server.dispatcher;
		if (dispatcher) {
			serverQueue.volume = 5 * (volume / 100);
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		}

		str = `Setting volume to ${volume}%`;
		message.channel.send(str);
	},
};
