import { defineStore } from 'pinia';

export const usePWAStore = defineStore('pwa', {
	state: () => {
		return {
			event: undefined,
			installed: true,
			load: false,
		};
	},
	actions: {
		isiOS() {
			if (
				['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
				(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
			)
				return true;
			else {
				return false;
			}
		},
		status() {
			if (this.isiOS()) return 'iOS';
			var standalone = false;
			if (
				navigator.standalone ||
				window.matchMedia('(display-mode: standalone)').matches ||
				window.matchMedia('(display-mode: fullscreen)').matches ||
				window.matchMedia('(display-mode: minimal-ui)').matches
			)
				standalone = true;
			if (this.event != undefined && !this.installed && !standalone) return 'installable';
			if (!('onbeforeinstallprompt' in window)) return 'unsupported';
			return 'unsupported';
		},
		install() {
			if (this.event == undefined) return;
			this.event.prompt();
			this.event.userChoice.then((res) => {
				if (res.outcome == 'accepted') {
					console.log('Aplikacja zainstalowana pomyślnie.');
					this.installed = true;
					this.load = true;
				} else {
					console.log('Instalacja została anulowana.');
				}
			});
		},
	},
});