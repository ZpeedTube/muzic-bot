const math = require('../util/math');

module.exports = {
	name: 'queue',
	description: 'Gets song queue',
	execute(message) {
		let str = 'Queue:';

		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		let index = 1, total = 0;
		if (serverQueue.songs.length >= 25) {
			str = 'Queue (1-25):';
		}
		serverQueue.songs.forEach(song => {
			str += `\n> **${song.title}** (${math.formatTime(song.duration)})`;
			if (index >= 25) {
				total += index;
				message.channel.send(str);
				str = `Queue (${(total + 1)}-${total + 25}):`;
				index = 1;
			}
			else {
				index++;
			}
		});

		message.channel.send(str);
	},
};
