import appConfigs from '@/stores/configs';

export default function colorHandler() {
	const colorScheme = usePreferredDark();
	let stopwatch;
	function updateColorMode() {
		if (appConfigs.value.user.colorMode === 'system') {
			window.document.body.classList.replace(colorScheme.value ? 'light' : 'dark', colorScheme.value ? 'dark' : 'light');
			if (!stopwatch)
				stopwatch = watch(colorScheme, () => {
					updateColorMode();
				});
		} else {
			if (stopwatch) {
				stopwatch();
				stopwatch = undefined;
			}
			const color = appConfigs.value.user.colorMode === 'light' ? [ 'dark', 'light' ] : [ 'light', 'dark' ];
			window.document.body.classList.replace(color[ 0 ], color[ 1 ]);
		}
	}
	watch(
		() => appConfigs.value.user.colorMode,
		() => {
			updateColorMode();
		},
		{ immediate: true }
	);
}
