import appConfigs from '@/stores/configs';
import parseColor from '@/functions/parseColor';

export default function parseLesson(lesson) {
	// Variables
	const user = useRouteParams('user');
	const mode = useRouteParams('mode');

	let subject = {};
	const columns = {};
	let colors = {};

	// Subject parsing
	let subjectData = appConfigs.value.timetable.subjects[ lesson.subject ];
	if (lesson.subject.includes('ckz')) {
		subjectData = appConfigs.value.timetable.subjects.praktyki;
	}
	if (subjectData === undefined) {
		addUnknowns(lesson.subject);
		subjectData = { short: lesson.subject };
	}
	subject = subjectData;

	// Columns parsing
	// Column #1
	if (lesson.subject.includes('ckz')) {
		columns.left = {
			name: '@',
		};
	} else if ([ 'n', 's' ].includes(mode.value)) {
		columns.left = {
			mode: 'o',
			id: lesson.classId,
			name: lesson.className,
		};
	} else {
		columns.left = {
			mode: 'n',
			id: appConfigs.value.school.allowStrudentsViewTeachers || user.value === 'nauczyciel' ? lesson.teacherId : undefined,
			name: lesson.teacher,
		};
	}

	// Column #2
	if (lesson.subject.includes('ckz')) {
		columns.right = {
			name: 'CKZ',
		};
	} else if ([ 'o', 'n' ].includes(mode.value)) {
		columns.right = {
			mode: 's',
			id: appConfigs.value.school.allowStrudentsViewRooms || user.value === 'nauczyciel' ? lesson.roomId : undefined,
			name: lesson.room,
		};
	} else {
		columns.right = {
			mode: 'n',
			id: appConfigs.value.school.allowStrudentsViewTeachers || user.value === 'nauczyciel' ? lesson.teacherId : undefined,
			name: lesson.teacher,
		};
	}

	// // Colors parsing
	// if (!appConfigs.value.user.showColors) {
	// 	colors = {
	// 		light: 'white',
	// 		dark: 'lightgray',
	// 	};
	// } else {
	const name = subject.short.replace(/ \([UR]{1}\)/, '');
	if (!appConfigs.value.database.subjects[ name ]) parseColor(name);
	colors = appConfigs.value.database.subjects[ name ];
	// }

	// Return
	return {
		subject,
		columns,
		colors,
	};
}
