import { defineStore } from 'pinia';
import { openDB } from 'idb';
import { TimetableList, Table } from '@wulkanowy/timetable-parser';

const PROXY = 'https://corsproxy.io/?';

export const usePlansStore = defineStore('plans', {
	state: () => {
		return {
			lists: {
				classes: [],
				teachers: [],
				rooms: [],
			},
			logo_path: '',
			amount: 0,
			loaded: 0,
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
		async setCache(url) {
			const store = await window.caches.open('timetables');
			await store.add(this.createURL(url));
		},
		async getCache(url) {
			const store = await window.caches.open('timetables');
			const res = await store.match(this.createURL(url));
			if (res != undefined) return await res.text();
			return undefined;
		},
		async getList() {
			const URL = 'https://zsm.resman.pl/plan_nauczyciele/lista.html';
			if ((await this.getCache(URL)) == undefined) await this.setCache(URL);
			const res = await this.getCache(URL);
			const TimeTable_List = new TimetableList(res);
			const result_list = TimeTable_List.getList();
			const result_logo = 'https://zsm.resman.pl/plan_nauczyciele/' + TimeTable_List.getLogoSrc();
			this.lists = result_list;
			this.logo_path = result_logo;
		},
		async getPlan(mode, id) {
			if (this.plans[mode][id] != undefined) return;
			this.plans[mode][id] = {};
			const URL = `https://zsm.resman.pl/plan_nauczyciele/plany/${mode}${id}.html`;
			if ((await this.getCache(URL)) == undefined) {
				await this.setCache(URL);
			}
			const res = await this.getCache(URL);
			const TimeTable = new Table(res);
			const result = {
				title: TimeTable.getTitle(),
				hours: TimeTable.getHours(),
				days: TimeTable.getRawDays(),
				gen_date: TimeTable.getGeneratedDate(),
				apply_date: TimeTable.getVersionInfo(),
			};
			this.plans[mode][id] = result;
			this.loaded += 1;
		},
		async getPlans() {
			this.lists.classes.forEach((class_obj) => {
				this.getPlan('o', class_obj.value);
			});
			this.lists.teachers.forEach((teacher_obj) => {
				this.getPlan('n', teacher_obj.value);
			});
			this.lists.rooms.forEach((room_obj) => {
				this.getPlan('s', room_obj.value);
			});
		},
		async getTimeTable() {
			await this.getList();
			this.loaded = 0;
			this.amount = this.lists.classes.length + this.lists.teachers.length + this.lists.rooms.length;
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
