import appData from '@/stores/data';
import log from '@/functions/console';

const LEVELS = {
	'-1': 'Piwnica',
	0: 'Parter',
	1: 'Poziom I',
	2: 'Poziom II',
};
const DATA = appData.value.school;

function parseClass(name) {
	let title, heading, sidebar, search;
	if ('classes' in DATA) {
		const regexData = name.match(/(\d\w+) \d([\w ]+)/);
		if (regexData) {
			const classData = {
				class: regexData[1],
				specialities: regexData[2].split(' '),
			};
			title = classData.class;
			heading = classData.class;
			sidebar = classData.class;
			search = {
				name: classData.class,
			};
			classData.specialities.forEach((speciality) => {
				const specialityData = DATA.classes[speciality];
				sidebar = `${sidebar} ${speciality}`;
				search[speciality] = speciality
				if (specialityData == undefined) {
					log('warn', 'Nieznany kierunek:', speciality);
					heading = `${heading} ${speciality}`;
				} else {
					heading = `${heading} ${specialityData}`;
				}
			});
		}
	}
	return {
		title: title ?? name,
		heading: heading ?? name,
		sidebar: sidebar ?? name,
		search: search ?? { name },
	};
}
function parseTeacher(name) {
	let title, heading, sidebar, search;
	if ('teachers' in DATA) {
		let teacherData = DATA.teachers[name];
		if (teacherData == undefined) {
			log('warn', 'Nieznany nauczyciel:', name);
			const regexData = name.match(/(.*\.)(.*) \((.*)\)/);
			if (regexData) {
				teacherData = {
					name: regexData[1],
					surname: regexData[2],
					code: regexData[3],
				};
			}
		}
		title = [teacherData.name, teacherData.surname].filter((e) => e).join(' ');
		heading = [teacherData.name, teacherData.surname, `(${teacherData.code})`].filter((e) => e).join(' ');
		sidebar =
			// CKZ
			name == 'c.Centrum Kształcenia Zawodowego (CK)'
				? // Nauczyciel VACAT
				  `CKZ (${teacherData.code})`
				: name.includes('vacat')
				? `VACAT (${teacherData.code})`
				: // Nazwa specjalna
				[
						'A.Aeroklub Rzeszowski (AA)',
						'E.Emeaero (EE)',
						'H.Heli One (HO)',
						'L.LineTech (LL)',
						'P.Pratt Whitney AeroPower (PT)',
						'S.Salony fryzjerskie (FR)',
				  ].includes(name)
				? `${teacherData.name} (${teacherData.code})`
				: // Zwykłe przypadki
				  [`${teacherData.name.charAt(0)}.`, teacherData.surname, `(${teacherData.code})`].filter((e) => e).join(' ');
		search = {
			name: teacherData.name,
			surname: teacherData.surname,
			code: teacherData.code,
		};
	}
	return {
		title: title ?? name,
		heading: heading ?? name,
		sidebar: sidebar ?? name,
		search: search ?? { name },
	};
}
function parseClassroom(name) {
	let title, heading, sidebar, search;
	if ('rooms' in DATA) {
		const roomData = DATA.rooms[name];
		if (roomData == undefined) {
			log('warn', 'Nieznana sala:', name);
		} else {
			title = name;
			heading = roomData.name ? `${name} (${roomData.name})` : name;
			sidebar = roomData.level != undefined ? `${name} (${LEVELS[roomData.level]})` : name;
			search = {
				name: name,
				fullName: roomData.name,
				level: roomData.level != undefined ? LEVELS[roomData.level] : undefined,
			};
		}
	}
	return {
		title: title ?? name,
		heading: heading ?? name,
		sidebar: sidebar ?? name,
		search: search ?? { name },
	};
}

export default function parseName(mode, name) {
	switch (mode) {
		case 'o':
			return parseClass(name || '');
		case 'n':
			return parseTeacher(name || '');
		case 's':
			return parseClassroom(name || '');
	}
}
