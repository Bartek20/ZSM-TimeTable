import appConfigs from '@/stores/configs';

export default function colorHandler() {
	const colorScheme = useMediaQuery('(prefers-color-scheme: dark)');
	var stopwatch;
	function updateColorMode() {
		if (appConfigs.value.colorMode == 'system') {
			window.document.body.classList.replace(colorScheme.value ? 'light' : 'dark', colorScheme.value ? 'dark' : 'light');
			if (!stopwatch)
				stopwatch = watch(colorScheme, () => {
					updateColorMode();
				});
		} else {
			if (stopwatch) stopwatch();
			const color = appConfigs.value.colorMode == 'light' ? ['dark', 'light'] : ['light', 'dark'];
			window.document.body.classList.replace(color[0], color[1]);
		}
	}
	updateColorMode();
	watch(appConfigs, (n) => updateColorMode());
}
