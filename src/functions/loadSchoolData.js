import appData from '@/stores/data';
import log from '@/functions/console';

export default async function loadSchoolData() {
	if (window.schoolData == 'loaded') return;
	await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}timetableData.js?t=${Date.now()}`)
		.then((e) => {
			appData.value.school = e.default;
		})
		.catch((e) => {
			const msg = Object.keys(appData.value.school).length == 0 ? 'Running in empty mode.' : 'Using cached data';
			log('error', `Failed to load timetable data.\n${msg}`);
		});
	window.schoolData = 'loaded';
}
