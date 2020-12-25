/**
 * Format a string or a number of seconds into HH:MM:SS string
 * @param {*} sec string or number
 */
exports.formatTime = (sec) => {
	const sec_num = parseInt(sec, 10);
	let hours = Math.floor(sec_num / 3600);
	let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	let seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) { hours = '0' + hours; }
	if (minutes < 10) { minutes = '0' + minutes; }
	if (seconds < 10) { seconds = '0' + seconds; }
	if (hours > 0) {
		return hours + ':' + minutes + ':' + seconds;
	}
	else {
		return minutes + ':' + seconds;
	}
};
