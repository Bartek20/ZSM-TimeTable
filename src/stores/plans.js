import { defineStore } from 'pinia';
import { TimetableList /*, Table*/ } from '@wulkanowy/timetable-parser';
import { MONTHS, HOURS } from '../functions/constants';
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
    parseDate(mode, date) {
      if (mode == 'gen') {
        const date_parts = date.split('-');
        return date_parts[2] + '/' + date_parts[1] + '/' + date_parts[0];
      }
      const date_parts = date.split(' ');
      return date_parts[0] + '/' + MONTHS[date_parts[1]] + '/' + date_parts[2];
    },
    async loadList(force = false) {
      if (!force && this.logo_path != '') return;
      const URL = '/data/lista.html';
      var res;
      try {
        res = await axios.get(URL);
      } catch (err) {
        console.warn('Wystąpił błąd przy wczytywaniu listy:\n', err);
        return;
      }
      if (res == undefined) return;
      const TimeTable_List = new TimetableList(res.data);
      const result_list = TimeTable_List.getList();
      const result_logo = WEBPAGE + TimeTable_List.getLogoSrc();
      this.lists = result_list;
      this.logo_path = result_logo;
    },
    async loadPlan(mode, id, force = false) {
      if (!force && this.plans[mode][id] != undefined && [0, 200, 404].includes(this.plans[mode][id])) return;
      this.plans[mode][id] = {
        status: 0,
      };
      const URL = `/data/plany/${mode}${id}.html`;
      var res;
      try {
        res = await axios.get(URL);
      } catch (err) {
        console.warn('Wystąpił błąd przy wczytywaniu planu:\n', err);
        if (err.response && err.response.status == 404) {
          this.plans[mode][id] = {
            status: 404,
          };
        } else if (err.code == 'ERR_NETWORK') {
          this.plans[mode][id] = {
            status: 900,
          };
        } else
          this.plans[mode][id] = {
            status: 999,
          };
        return;
      }
      if (res == undefined) {
        this.plans[mode][id] = undefined;
        return;
      }
      const TimeTable = new Table(res.data);
      const result = {
        title: TimeTable.getTitle(),
        hours: this.getHours(res.data),
        days: TimeTable.getDays(),
        gen_date: this.parseDate('gen', TimeTable.getGeneratedDate()),
        apply_date: this.parseDate('ver', TimeTable.getVersionInfo()),
        status: 200,
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
      await this.loadList(true);
      this.getPlans();
    },
  },
  persist: import.meta.env.MODE != 'development',
});

/*
Idea:
https://dribbble.com/shots/20715814-Global-education-Timetable
*/
