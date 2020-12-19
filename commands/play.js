const ytdl = require('ytdl-core');

module.exports = {
	name: 'play',
	description: 'Play a song in your channel!',
	async execute(message, server) {
		try {
			if (server.timeoutLeave) {
				clearInterval(server.timeoutLeave);
			}
			const args = message.content.split(' ');
			const queue = message.client.queue;
			const serverQueue = message.client.queue.get(message.guild.id);

			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					'You need to be in a voice channel to play music!',
				);
			}
			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
				return message.channel.send(
					'I need the permissions to join and speak in your voice channel!',
				);
			}

			const songInfo = await ytdl.getInfo(args[1]);
			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
			};

			if (!serverQueue) {
				const config = server.getConfig();
				const volume = 5 * (config.volume / 100);
				console.log('bot volume', volume);

				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: volume,
					playing: true,
				};

				queue.set(message.guild.id, queueContruct);

				queueContruct.songs.push(song);

				try {
					const connection = await voiceChannel.join();
					queueContruct.connection = connection;
					this.play(message, queueContruct.songs[0], server);
				}
				catch (err) {
					console.log(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			}
			else {
				serverQueue.songs.push(song);
				return message.channel.send(
					`Added to the queue **${song.title}**`,
				);
			}
		}
		catch (error) {
			console.log(error);
			message.channel.send(error.message);
		}
	},

	play(message, song, server) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);

		if (!song) {
			server.timeoutLeave = setTimeout(() => {
				serverQueue.voiceChannel.leave();
			}, server.timeout * 1000);
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(ytdl(song.url))
			.on('finish', () => {
				serverQueue.songs.shift();
				this.play(message, serverQueue.songs[0]);
			})
			.on('error', error => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		server.dispatcher = dispatcher;
		console.log('dispatcher added?');

		serverQueue.textChannel.send(`Start playing: **${song.title}**`);
	},
};
