function qs(dom, selector) {
  return dom.querySelector(selector);
}
function qsa(dom, selector) {
  return [...dom.querySelectorAll(selector)];
}

export class TimeTableList {
  $;
  constructor(html) {
    this.$ = document.createElement('vdom');
    this.$.innerHTML = html
      .slice(html.indexOf('<body>'), html.indexOf('</body>'))
      .replace(/<img name=\".*\" border=\"0\" src=\".*\" width=\"16\" height=\"16\"\/>/, '');
  }
  getList() {
    const listType = this.getListType();
    if (listType === 'select') {
      return this.getSelectList();
    }
    if (listType === 'unordered') {
      return this.getUnorderedList();
    }
    return this.getExpandableList();
  }
  getListType() {
    if (qsa(this.$, 'form[name=form]').length > 0) {
      return 'select';
    }
    if (qsa(this.$, 'vdom table').length > 0) {
      return 'expandable';
    }
    return 'unordered';
  }
  getLogoSrc() {
    return qs(this.$, '.logo img').getAttribute('src') || '';
  }
  getSelectList() {
    return {
      classes: this.getSelectListValues('oddzialy'),
      teachers: this.getSelectListValues('nauczyciele'),
      rooms: this.getSelectListValues('sale'),
    };
  }
  getSelectListValues(name) {
    const nodes = qsa(this.$, `[name=${name}] option`);
    nodes.shift();
    const values = [];
    nodes.forEach((node) => {
      values.push({
        name: node.innerText,
        value: node.getAttribute('value') || '',
      });
    });
    return values;
  }
  getExpandableList() {
    return this.getTimetableUrlSubType('#oddzialy a', '#nauczyciele a', '#sale a');
  }
  getUnorderedList() {
    let teachersQuery = 'ul:nth-of-type(2) a';
    let roomsQuery = 'ul:nth-of-type(3) a';
    if (qsa(this.$, 'h4').length === 1) {
      teachersQuery = 'undefined';
      roomsQuery = 'undefined';
    } else if (qs(this.$, 'h4:nth-of-type(2)')?.innerText === 'Sale') {
      teachersQuery = 'undefined';
      roomsQuery = 'ul:nth-of-type(2) a';
    }
    return this.getTimetableUrlSubType('ul:first-of-type a', teachersQuery, roomsQuery);
  }
  getTimetableUrlSubType(classQuery, teachersQuery, roomsQuery) {
    return {
      classes: this.getSubTypeValue(classQuery, 'o'),
      teachers: this.getSubTypeValue(teachersQuery, 'n'),
      rooms: this.getSubTypeValue(roomsQuery, 's'),
    };
  }
  getSubTypeValue(query, prefix) {
    const values = [];

    const nodes = qsa(this.$, query);
    nodes.forEach((node) => {
      values.push({
        name: node.innerText,
        value: node.getAttribute('href')?.replace('.html', '').replace(`plany/${prefix}`, '') || '',
      });
    });
    return values;
  }
}

export class TimeTable {
  $;
  constructor(html) {
    this.$ = document.createElement('vdom');
    this.$.innerHTML = html.slice(html.indexOf('<body>'), html.indexOf('</body>'));
  }
  getTitle() {
    return qs(this.$, '.tytulnapis').innerText;
  }
  getDayNames() {
    return qsa(this.$, '.tabela tr:first-of-type th')
      .map((element) => element.innerText)
      .slice(2);
  }
  getHours() {
    const rows = qsa(this.$, '.tabela tr:not(:first-of-type)');
    const hours = [];
    rows.forEach((row) => {
      const number = parseInt(qs(row, '.nr').innerText.trim(), 10);
      const timesText = qs(row, '.g').innerText;
      const [timeFrom, timeTo] = timesText.split('-').map((e) => e.trim());
      hours.push({
        number,
        timeFrom,
        timeTo,
      });
    });
    return hours;
  }
  getDays() {
    const rows = qsa(this.$, '.tabela tr:not(:first-of-type)');
    const days = [[], [], [], [], []];
    rows.forEach((row) => {
      const lessons = qsa(row, '.l');
      lessons.forEach((lesson, index) => {
        if (lesson.innerText.trim() === '') {
          days[index].push([]);
        } else if (lesson.children.length === 0) {
          days[index].push([{ subject: lesson.innerText.trim() }]);
        } else {
          const groups = this.parseLessons([...lesson.children]);
          days[index].push(groups);
        }
      });
    });
    return days;
  }
  getGeneratedDate() {
    const regex = /wygenerowano (\d{1,4})[./-](\d{1,2})[./-](\d{1,4})/;
    return (
      qsa(this.$, 'td')
        .map((e) => {
          const match = regex.exec(e.innerText);
          if (match === null) return null;
          const parts = [match[1], match[2], match[3]];
          if (parts[0].length !== 4) parts.reverse();
          return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
        })
        .filter((e) => e != null)[0] || null
    );
  }
  getVersionInfo() {
    const regex = /^Obowiązuje od: (.+)$/;
    const MONTHS = {
      stycznia: 1,
      lutego: 2,
      marca: 3,
      kwietnia: 4,
      maja: 5,
      czerwca: 6,
      lipca: 7,
      sierpnia: 8,
      września: 9,
      października: 10,
      listopada: 11,
      grudnia: 12,
    };
    return (
      qsa(this.$, 'td')
        .map((e) => {
          const match = regex.exec(e.innerText.trim());
          if (match === null) return '';
          const date = match[1].trim().split(' ');
          return `${date[0]}/${MONTHS[date[1]].toString().padStart(2, '0')}/${date[2]}`;
        })
        .filter((e) => e !== '')[0] || ''
    );
  }
  parseLessons(data) {
    const lines = [[]];
    data.forEach((element) => {
      if (element.nodeName === 'BR') {
        lines.push([]);
        return;
      }
      lines[lines.length - 1].push(element);
    });
    return lines.flatMap((line) => {
      const common = { subject: '' };
      const groups = [{}];
      line.forEach((el) => {
        if (el.nodeName === '#text') {
          el.innerText.split(',').forEach((part, index) => {
            if (index > 0) groups.push({});
            if (part.trim() === '') return;
            const groupNameMatch = part.trim().match(/-(\d+\/\d+)/);
            if (groupNameMatch !== null) groups[groups.length - 1].groupName = groupNameMatch[1];
          });
          return;
        }
        const group = groups[groups.length - 1];
        const withElement = (className, callback) => {
          if (el.classList.contains(className)) return callback([el]);
          const children = qsa(el, `.${className}`);
          if (children.length > 0) callback(children);
        };
        const getId = (el, letter) => {
          const href = el.getAttribute('href') || '';
          return new RegExp(`^${letter}(.+)\\.html$`).exec(href)?.[1];
        };
        withElement('p', (child) => {
          const match = child[0].innerText.trim().match(/^(.*?)(?:-(\d+\/\d+))?$/);
          if (!match) return;
          if (match[2]) group.groupName = match[2];
          if (match[1]) {
            if (common.subject) common.subject += ' ';
            common.subject += match[1].trim();
          }
        });
        withElement('o', (child) => {
          group.className = child[0].innerText;
          group.classId = getId(child[0], 'o');
        });
        withElement('n', (child) => {
          common.teacher = child[0].innerText;
          common.teacherId = getId(child[0], 'n');
        });
        withElement('s', (child) => {
          common.room = child[0].innerText;
          common.roomId = getId(child[0], 's');
        });
      });
      if (common.subject.trim() === '') return [];
      return groups.map((group) => ({
        ...common,
        ...group,
      }));
    });
  }
}
