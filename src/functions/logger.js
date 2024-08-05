export default function log(mode, ...args) {
	let icon = code = undefined;
	if (!['log', 'info', 'warn', 'error'].includes(mode)) return;
	switch (mode) {
		case 'log':
			icon = '🔷';
			code = 'LOG';
			break;
		case 'info':
			icon = '🔷';
			code = 'INFO';
			break;
		case 'warn':
			icon = '🔶';
			code = 'WARNING';
			break;
		case 'error':
			icon = '❌';
			code = 'ERROR';
			break;
	}
	console[mode](`${icon} [${code}]`, ...args);
	return;
}
