import cheerio from 'cheerio';
export default class Table {
	constructor(html) {
		this.$ = cheerio.load(html);
	}
	/*
	 * Parses the text from the header, for instance class name
	 */
	getTitle() {
		return this.$('.tytulnapis').text();
	}
	getDayNames() {
		return this.$('.tabela tr:first-of-type th')
			.toArray()
			.map((element) => this.$(element).text())
			.slice(2);
	}
	getHours() {
		const rows = this.$('.tabela tr:not(:first-of-type)').toArray();
		const hours = {};
		rows.forEach((row) => {
			const number = parseInt(this.$(row).find('.nr').text().trim(), 10);
			const timesText = this.$(row).find('.g').text();
			const [timeFrom, timeTo] = timesText.split('-').map((e) => e.trim());
			hours[number] = {
				number,
				timeFrom,
				timeTo,
			};
		});
		return hours;
	}
	/*
	 * Return table in original form (without transposing) for easier displaying.
	 */
	getRawDays() {
		const rows = this.$('.tabela tr:not(:first-of-type)').toArray();
		const days = [];
		rows.forEach((row, index) => {
			const lessons = this.$(row).find('.l').toArray();
			lessons.forEach((lesson) => {
				if (!days[index]) days.push([]);
				if (this.$(lesson).text().trim() === '') {
					days[index].push([]);
				} else if (this.$(lesson).children().length === 0) {
					days[index].push([{ subject: this.$(lesson).text().trim() }]);
				} else {
					const groups = this.parseLessons(this.$(lesson).contents().toArray());
					days[index].push(groups);
				}
			});
		});
		return days;
	}
	getDays() {
		const rows = this.$('.tabela tr:not(:first-of-type)').toArray();
		const days = [[], [], [], [], []];
		rows.forEach((row) => {
			const lessons = this.$(row).find('.l').toArray();
			lessons.forEach((lesson, index) => {
				if (this.$(lesson).text().trim() === '') {
					days[index].push([]);
				} else if (this.$(lesson).children().length === 0) {
					days[index].push([{ subject: this.$(lesson).text().trim() }]);
				} else {
					const groups = this.parseLessons(this.$(lesson).contents().toArray());
					days[index].push(groups);
				}
			});
		});
		return days;
	}
	/*
		Date in ISO 8601 format
	 */
	getGeneratedDate() {
		const regex = /wygenerowano (\d{1,4})[./-](\d{1,2})[./-](\d{1,4})/;
		return (
			this.$('td')
				.toArray()
				.map((e) => {
					const match = regex.exec(this.$(e).text());
					if (match === null) return null;
					const parts = [match[1], match[2], match[3]];
					if (parts[0].length !== 4) parts.reverse();
					return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
				})
				.filter((e) => e != null)[0] || null
		);
	}
	/*
		Usually includes the dates when the table is valid.
	 */
	getVersionInfo() {
		const regex = /^Obowiązuje od: (.+)$/;
		return (
			this.$('td')
				.toArray()
				.map((e) => {
					const match = regex.exec(this.$(e).text().trim());
					if (match === null) return '';
					return match[1].trim();
				})
				.filter((e) => e !== '')[0] || ''
		);
	}
	parseLessons(data) {
		const lines = [[]];
		data.forEach((element) => {
			if (element.tagName === 'br') {
				lines.push([]);
				return;
			}
			lines[lines.length - 1].push(this.$(element));
		});
		return lines.flatMap((line) => {
			const common = { subject: '' };
			const groups = [{}];
			line.forEach((el) => {
				if (el[0].type === 'text') {
					el.text()
						.split(',')
						.forEach((part, index) => {
							if (index > 0) groups.push({});
							if (part.trim() === '') return;
							const groupNameMatch = part.trim().match(/-(\d+\/\d+)/);
							if (groupNameMatch !== null) groups[groups.length - 1].groupName = groupNameMatch[1];
						});
					return;
				}
				const group = groups[groups.length - 1];
				const withElement = (className, callback) => {
					if (el.hasClass(className)) return callback(el);
					const children = el.find(`.${className}`);
					if (children.length > 0) callback(children);
				};
				const getId = (el, letter) => {
					var _a;
					const href = el.attr('href');
					return (_a = new RegExp(`^${letter}(.+)\\.html$`).exec(href)) === null || _a === void 0 ? void 0 : _a[1];
				};
				withElement('p', (child) => {
					const match = child
						.text()
						.trim()
						.match(/^(.*?)(?:-(\d+\/\d+))?$/);
					if (!match) return;
					if (match[2]) group.groupName = match[2];
					if (match[1]) {
						if (common.subject) common.subject += ' ';
						common.subject += match[1].trim();
					}
				});
				withElement('o', (child) => {
					group.className = child.text();
					group.classId = getId(child, 'o');
				});
				withElement('n', (child) => {
					common.teacher = child.text();
					common.teacherId = getId(child, 'n');
				});
				withElement('s', (child) => {
					common.room = child.text();
					common.roomId = getId(child, 's');
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
