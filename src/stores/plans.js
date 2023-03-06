import { defineStore } from 'pinia';
import axios from 'axios';
import { TimetableList, Table } from '@wulkanowy/timetable-parser';

const API = 'https://plan.tata2676.workers.dev/';
const PROXY = 'https://corsproxy.io/?';

export const usePlansStore = defineStore('plans', {
	state: () => {
		return {
			lists: {
				classes: [],
				teachers: [],
				rooms: [],
			},
			logo_path: undefined,
			plans: {
				o: {},
				n: {},
				s: {},
			},
		};
	},
	actions: {
		async proxy(url) {
			const res = await axios.get(PROXY + encodeURIComponent(url));
			return res.data;
		},
		async getList() {
			const res = await this.proxy('https://zsm.resman.pl/plan_nauczyciele/lista.html');
			const TimeTable_List = new TimetableList(res);
			this.lists = TimeTable_List.getList();
			this.logo_path = 'https://zsm.resman.pl/plan_nauczyciele/' + TimeTable_List.getLogoSrc();
		},
		async getPlan(mode, id) {
			const res = await this.proxy(`https://zsm.resman.pl/plan_nauczyciele/plany/${mode}${id}.html`);
			const TimeTable = new Table(res);
			this.plans[mode][id] = {
				title: TimeTable.getTitle(),
				days: TimeTable.getDays(),
				gen_date: TimeTable.getGeneratedDate(),
				apply_date: TimeTable.getVersionInfo(),
			};
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
			await this.getPlans();
		},
	},
});

/*
Idea:
https://dribbble.com/shots/20715814-Global-education-Timetable
*/
