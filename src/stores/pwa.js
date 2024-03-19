import log from '@/functions/logger';

const appPWA = createGlobalState(() => {
	const event = ref(undefined);
	const installed = ref(true);

	const status = computed(() => {
		if (isiOS()) return 'iOS';
		let standalone = false;
		if (
			navigator.standalone ||
			window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			window.matchMedia('(display-mode: minimal-ui)').matches
		)
			standalone = true;
		if (event.value != undefined && !installed.value && !standalone) return 'installable';
		if (!('onbeforeinstallprompt' in window)) return 'unsupported';
		return 'unsupported';
	});

	// actions
	function isiOS() {
		if (
			['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		)
			return true;
		else {
			return false;
		}
	}
	function install() {
		if (event.value == undefined) return;
		event.value.prompt();
		event.value.userChoice.then((res) => {
			if (res.outcome == 'accepted') {
				log('info', '[PWA] Aplikacja zainstalowana pomyślnie.');
				installed.value = true;
			} else {
				log('info', '[PWA] Instalacja została anulowana.');
			}
		});
	}

	return { event, installed, status, install };
});

export default appPWA;
