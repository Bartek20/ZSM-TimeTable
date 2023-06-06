export const usePlansStore = defineStore('plans', {
  state: () => {
    return {
      lists: {
        classes: [],
        teachers: [],
        rooms: [],
      },
      plans: {
        o: {},
        n: {},
        s: {},
      },
    };
  },
  actions: {
    async loadList(force = false) {
      if (!force && this.lists.classes.length != 0) return;
      const URL = '/plan_vulcan/lista.html';
      var res;
      try {
        res = await axios.get(URL);
      } catch (err) {
        console.error('Wystąpił błąd przy wczytywaniu listy:\n', err);
        return;
      }
      if (res == undefined) return;
      const TTList = new TimeTableList(res.data);
      const result_list = TTList.getList();
      this.lists = result_list;
    },
    async loadPlan(mode, id, force = false) {
      if (!force && this.plans[mode][id] != undefined && [0, 200, 404].includes(this.plans[mode][id])) return;
      this.plans[mode][id] = {
        status: 0,
      };
      const URL = `/plan_vulcan/plany/${mode}${id}.html`;
      var res;
      try {
        res = await axios.get(URL);
      } catch (err) {
        console.error('Wystąpił błąd przy wczytywaniu planu:\n', err);
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
        this.plans[mode][id] = {
          status: 999,
        };
        return;
      }
      if (!res.data.includes('table')) {
        this.plans[mode][id] = {
          status: 404,
        };
      }
      const TT = new TimeTable(res.data);
      const result = {
        title: TT.getTitle(),
        hours: TT.getHours(),
        days: TT.getDays(),
        gen_date: TT.getGeneratedDate(),
        apply_date: TT.getVersionInfo(),
        status: 200,
      };
      this.plans[mode][id] = result;
    },
    async getPlans() {
      this.lists.classes.forEach((obj) => {
        axios.get(`/plan_vulcan/plany/o${obj.value}.html`);
      });
      this.lists.teachers.forEach((obj) => {
        axios.get(`/plan_vulcan/plany/n${obj.value}.html`);
      });
      this.lists.rooms.forEach((obj) => {
        axios.get(`/plan_vulcan/plany/s${obj.value}.html`);
      });
    },
    async getTimeTable() {
      await axios.get(`${import.meta.env.BASE_URL}school-data.json`);
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
