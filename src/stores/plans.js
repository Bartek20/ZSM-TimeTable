import { defineStore } from 'pinia';
import { openDB } from 'idb';
import { TimetableList/*, Table*/ } from '@wulkanowy/timetable-parser';
// Temporary fix until @wulkanowy/timetable-parser #24 PR update
import Table from '@/functions/tableParser';

const PROXY = 'https://corsproxy.io/?';
const WEBPAGE = 'https://zsm.resman.pl/plan_nauczyciele/';

export const usePlansStore = defineStore('plans', {
	state: () => {
		return {
			lists: {
				classes: [],
				teachers: [],
				rooms: [],
			},
			logo_path: '',
			plans: {
				o: {},
				n: {},
				s: {},
			},
		};
	},
	actions: {
		createURL(url) {
			return window.location.host == 'zsm.resman.pl' ? url : PROXY + encodeURIComponent(url);
		},
		async cacheURL(url) {
			const URL = this.createURL(url);
			const store = await window.caches.open('timetables');
			var res = await store.match(URL);
			if (res == undefined) {
				try {
					await store.add(URL);
				} catch (error) {
					return undefined;
				}
			}
			var res = await store.match(URL);
			if (res != undefined) return await res.text();
			return undefined;
		},
		async loadList() {
			const URL = WEBPAGE + 'lista.html';
			const res = await this.cacheURL(URL);
			if (res == undefined) return;
			const TimeTable_List = new TimetableList(res);
			const result_list = TimeTable_List.getList();
			const result_logo = WEBPAGE + TimeTable_List.getLogoSrc();
			this.lists = result_list;
			this.logo_path = result_logo;
		},
		async loadPlan(mode, id) {
			if (this.plans[mode][id] != undefined) return;
			this.plans[mode][id] = {};
			const URL = WEBPAGE + `plany/${mode}${id}.html`;
			const res = await this.cacheURL(URL);
			if (res == undefined) {
				this.plans[mode][id] = undefined;
				return;
			}
			const TimeTable = new Table(res);
			const result = {
				title: TimeTable.getTitle(),
				hours: TimeTable.getHours(),
				days: TimeTable.getDays(),
				gen_date: TimeTable.getGeneratedDate(),
				apply_date: TimeTable.getVersionInfo(),
			};
			this.plans[mode][id] = result;
		},
		async getPlans() {
			this.lists.classes.forEach((obj) => {
				this.cacheURL(WEBPAGE + 'plany/o' + obj.value + '.html');
			});
			this.lists.teachers.forEach((obj) => {
				this.cacheURL(WEBPAGE + 'plany/n' + obj.value + '.html');
			});
			this.lists.rooms.forEach((obj) => {
				this.cacheURL(WEBPAGE + 'plany/s' + obj.value + '.html');
			});
		},
		async getTimeTable() {
			await this.loadList();
			await this.getPlans();
		},
		async updateTimeTable() {
			await window.caches.delete('timetables');
			(await this.dbs.lists).clear('data');
			(await this.dbs.plans).clear('o');
			(await this.dbs.plans).clear('n');
			(await this.dbs.plans).clear('s');
			this.lists.classes = [];
			this.lists.teachers = [];
			this.lists.rooms = [];
			this.classes.o = {};
			this.classes.n = {};
			this.classes.s = {};
			await this.getTimeTable();
		},
	},
	persist: true,
});

/*
Idea:
https://dribbble.com/shots/20715814-Global-education-Timetable
*/
