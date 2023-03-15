import { defineStore } from 'pinia';

const days = {
	poniedziałek: 0,
	wtorek: 1,
	środa: 2,
	czwartek: 3,
	piątek: 4,
};

export const useTimeStore = defineStore('time', {
	state: () => {
		return {
			DAY: undefined,
			TIME: undefined,
		};
	},
	actions: {
		setTwo(el) {
			if (el < 10) return '0' + el;
			return el;
		},
		checkBetween(start, end) {
			const start_el = start.split(':');
			const start_time = new Date();
			start_time.setHours(start_el[0], start_el[1], 0, 0);
			const end_el = end.split(':');
			const end_time = new Date();
			end_time.setHours(end_el[0], end_el[1], 59, 999);
			const current = new Date();
			return current >= start_time && current <= end_time;
		},
		getTime() {
			const date = new Date();
			this.DAY = days[date.toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw', weekday: 'long' })];
			this.TIME = date
				.toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
				.replace(/\d{2}\.\d{2}\.\d{4}, /, '')
				.replace(/:\d{2}$/, '');
		},
	},
});
