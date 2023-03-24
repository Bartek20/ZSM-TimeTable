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
		status() {
			if (!window.onbeforeinstallprompt) return false;
			return this.event != undefined && !this.installed && !window.matchMedia('(display-mode:standalone)').matches;
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
