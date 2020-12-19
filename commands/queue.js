module.exports = {
	name: 'queue',
	description: 'Gets song queue',
	execute(message) {
		let str = 'Queue:';

		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		serverQueue.songs.forEach(song => {
			str += `\n> **${song.title}**`;
		});

		message.channel.send(str);
	},
};
