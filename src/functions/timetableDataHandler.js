import appConfigs from '@/stores/configs';
import log from '@/functions/logger';
import { useToast } from 'vue-toastification';

const toast = useToast();

export default function parseData(obj, data) {
	switch (obj) {
		case 'shortLessons':
			if (appConfigs.value.timetable.shortLessons.length === 0) {
				appConfigs.value.timetable.shortLessons = data;
			} else if (appConfigs.value.timetable.shortLessons.length !== data.length) {
				log('warn', '[App] Zmodyfikowano godziny trwania skróconych lekcji');
				toast.info('Zmodyfikowano godziny trwania skróconych lekcji');
				appConfigs.value.timetable.shortLessons = data;
			}
			break;
		case 'levels':
			if (Object.keys(appConfigs.value.timetable.levels).length === 0) {
				appConfigs.value.timetable.levels = data;
			} else {
				const diff = [];
				const newData = Object.keys(data);
				newData.forEach((key) => {
					if (data[key] !== appConfigs.value.timetable.levels[key]) {
						diff.push({
							idx: key,
							src: appConfigs.value.timetable.levels[key],
							dest: data[key],
						});
						appConfigs.value.timetable.levels[key] = data[key];
					}
				});
				if (diff.length) {
					let msg = 'Zmodyfikowno nazwy poziomów:';
					diff.forEach((d) => (msg += `\n${d.idx}: ${d.src} -> ${d.dest}`.replace(/ [(]?undefined[)]?/g, '').replace(': ->', ': Nieznany ->')));
					log('warn', '[App]', msg);
					toast.info('Zmodyfikowano nazwy poziomów');
					appConfigs.value.database.rooms = {};
				}
			}
			break;
		case 'classes':
			if (Object.keys(appConfigs.value.timetable.classes).length === 0) {
				appConfigs.value.timetable.classes = data;
			} else {
				const diff = [];
				const newData = Object.keys(data);
				newData.forEach((key) => {
					if (data[key] !== appConfigs.value.timetable.classes[key]) {
						diff.push({
							idx: key,
							src: appConfigs.value.timetable.classes[key],
							dest: data[key],
						});
						appConfigs.value.timetable.classes[key] = data[key];
					}
				});
				if (diff.length) {
					let msg = 'Zmodyfikowno nazwy kierunków:';
					diff.forEach((d) => (msg += `\n${d.idx}: ${d.src} -> ${d.dest}`.replace(/ [(]?undefined[)]?/g, '').replace(': ->', ': Nieznany ->')));
					log('warn', '[App]', msg);
					toast.info('Zmodyfikowano nazwy kierunków');
					appConfigs.value.database.classes = {};
				}
			}
			break;
		case 'teachers':
			if (Object.keys(appConfigs.value.timetable.teachers).length === 0) {
				appConfigs.value.timetable.teachers = data;
			} else {
				const diff = [];
				const newData = Object.keys(data);
				newData.forEach((key) => {
					if (
						!appConfigs.value.timetable.teachers[key] ||
						data[key].name !== appConfigs.value.timetable.teachers[key].name ||
						data[key].surname !== appConfigs.value.timetable.teachers[key].surname ||
						data[key].code !== appConfigs.value.timetable.teachers[key].code
					) {
						diff.push({
							idx: key,
							src: appConfigs.value.timetable.teachers[key],
							dest: data[key],
						});
						appConfigs.value.timetable.teachers[key] = data[key];
						appConfigs.value.database.teachers[key] = undefined;
					}
				});
				if (diff.length) {
					let msg = 'Zmodyfikowno dane nauczycieli:';
					diff.forEach(
						(d) =>
							(msg += `\n${d.idx}: ${d.src?.name} ${d.src?.surname} (${d.src?.code}) -> ${d.dest.name} ${d.dest.surname} (${d.dest.code})`
								.replace(/ [(]?undefined[)]?/g, '')
								.replace(': ->', ': Nieznany ->'))
					);
					log('warn', '[App]', msg);
					toast.info('Zmodyfikowano dane nauczycieli');
				}
			}
			break;
		case 'rooms':
			if (Object.keys(appConfigs.value.timetable.rooms).length === 0) {
				appConfigs.value.timetable.rooms = data;
			} else {
				const diff = [];
				const newData = Object.keys(data);
				newData.forEach((key) => {
					if (
						!appConfigs.value.timetable.rooms[key] ||
						data[key].level !== appConfigs.value.timetable.rooms[key].level ||
						data[key].name !== appConfigs.value.timetable.rooms[key].name
					) {
						diff.push({
							idx: key,
							src: appConfigs.value.timetable.rooms[key],
							dest: data[key],
						});
						appConfigs.value.timetable.rooms[key] = data[key];
						appConfigs.value.database.rooms[key] = undefined;
					}
				});
				if (diff.length) {
					let msg = 'Zmodyfikowno dane sali:';
					diff.forEach(
						(d) =>
							(msg += `\n${d.idx}: ${d.src?.name} (${d.src?.level}) -> ${d.dest.name} (${d.dest.level})`
								.replace(/ [(]?undefined[)]?/g, '')
								.replace(': ->', ': Nieznany ->'))
					);
					log('warn', '[App]', msg);
					toast.info('Zmodyfikowano dane sali');
				}
			}
			break;
		case 'subjects':
			if (Object.keys(appConfigs.value.timetable.subjects).length === 0) {
				appConfigs.value.timetable.subjects = data;
			} else {
				const diff = [];
				const newData = Object.keys(data);
				newData.forEach((key) => {
					if (
						!appConfigs.value.timetable.subjects[key] ||
						data[key].short !== appConfigs.value.timetable.subjects[key].short ||
						data[key].full !== appConfigs.value.timetable.subjects[key].full
					) {
						diff.push({
							idx: key,
							src: appConfigs.value.timetable.subjects[key],
							dest: data[key],
						});
						appConfigs.value.timetable.subjects[key] = data[key];
						appConfigs.value.database.subjects[data[key].short.replace(/ \([UR]{1}\)/, '')] = undefined;
					}
				});
				if (diff.length) {
					let msg = 'Zmodyfikowno dane przedmiotów:';
					diff.forEach(
						(d) =>
							(msg += `\n${d.idx}: ${d.src?.short} (${d.src?.full}) -> ${d.dest.short} (${d.dest.full})`
								.replace(/ [(]?undefined[)]?/g, '')
								.replace(': ->', ': Nieznany ->'))
					);
					log('warn', '[App]', msg);
					toast.info('Zmodyfikowano dane przedmiotów');
				}
			}
			break;
		// no default
	}
}
