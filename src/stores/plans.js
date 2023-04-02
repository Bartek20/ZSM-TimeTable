import { defineStore } from 'pinia';
import { TimetableList /*, Table*/ } from '@wulkanowy/timetable-parser';
import { HOURS } from '../functions/constants';
// Temporary fix until @wulkanowy/timetable-parser #24 PR update
import Table from '@/functions/tableParser';
import axios from 'axios';

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
		getHours(html) {
			const li = html.match(/<td class="nr">\d+<\/td>/gm);
			var out = [];
			li.forEach((el) => {
				const id = el.replace('<td class="nr">', '').replace('</td>', '');
				out.push(HOURS[id]);
			});
			return out;
		},
		async loadList() {
			if (this.logo_path != '') return;
			const URL = '/data/lista.html';
			const res = await axios.get(URL);
			if (res == undefined) return;
			const TimeTable_List = new TimetableList(res.data);
			const result_list = TimeTable_List.getList();
			const result_logo = WEBPAGE + TimeTable_List.getLogoSrc();
			this.lists = result_list;
			this.logo_path = result_logo;
		},
		async loadPlan(mode, id) {
			if (this.plans[mode][id] != undefined) return;
			this.plans[mode][id] = {};
			const URL = `/data/plany/${mode}${id}.html`;
			const res = await axios.get(URL);
			if (res == undefined) {
				this.plans[mode][id] = undefined;
				return;
			}
			const TimeTable = new Table(res.data);
			const result = {
				title: TimeTable.getTitle(),
				hours: this.getHours(res.data),
				days: TimeTable.getDays(),
				gen_date: TimeTable.getGeneratedDate(),
				apply_date: TimeTable.getVersionInfo(),
			};
			this.plans[mode][id] = result;
		},
		async getPlans() {
			this.lists.classes.forEach((obj) => {
				axios.get('/data/plany/o' + obj.value + '.html');
			});
			this.lists.teachers.forEach((obj) => {
				axios.get('/data/plany/n' + obj.value + '.html');
			});
			this.lists.rooms.forEach((obj) => {
				axios.get('/data/plany/s' + obj.value + '.html');
			});
		},
		async getTimeTable() {
			await this.loadList();
			this.getPlans();
		},
		async updateTimeTable() {
			this.lists.classes = [];
			this.lists.teachers = [];
			this.lists.rooms = [];
			this.classes.o = {};
			this.classes.n = {};
			this.classes.s = {};
			await this.getTimeTable();
		},
	},
	persist: import.meta.env.MODE != 'development',
});

/*
Idea:
https://dribbble.com/shots/20715814-Global-education-Timetable
*/
