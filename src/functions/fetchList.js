import appConfigs from '@/stores/configs';
import appData from '@/stores/data';
import log from '@/functions/logger';

function qs(dom, selector) {
	return dom.querySelector(selector);
}
function qsa(dom, selector) {
	return [...dom.querySelectorAll(selector)];
}

export class TimeTableList {
	constructor(html) {
		this.$ = document.createElement('vdom');
		this.$.innerHTML = html.slice(html.indexOf('<body>'), html.indexOf('</body>')).replaceAll('src=', 'url=');
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
		return qs(this.$, '.logo img').getAttribute('url') || '';
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

export default async function loadList() {
	try {
		const res = await axios.get(`${appConfigs.value.school.timetableURL}lista.html`);
		if (res == undefined) return;
		appData.list.value = new TimeTableList(res.data).getList();
	} catch (err) {
		log('error', 'Wystąpił błąd przy wczytywaniu listy:\n', err);
		return;
	}
}
