import log from '@/functions/logger';

const appPWAState = createGlobalState(() => {
	const event = ref();
	const installed = ref(true);

	const status = computed(() => {
		if (!('onbeforeinstallprompt' in window)) return 'unsupported';
		if (event.value !== undefined && !installed.value) return 'installable';
		if (
			navigator.standalone ||
			window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			window.matchMedia('(display-mode: minimal-ui)').matches ||
			window.isPWA
		)
			return 'standalone';
		return 'unsupported';
	});

	function install() {
		if (event.value === undefined) return;
		event.value.prompt();
		event.value.userChoice.then((res) => {
			if (res.outcome === 'accepted') {
				log('info', '[PWA] Instalacja została zaakceptowana.');
				installed.value = true;
			} else {
				log('info', '[PWA] Instalacja została anulowana.');
			}
		});
	}

	return { event, installed, status, install };
});

const appPWA = appPWAState()

export default appPWA;
