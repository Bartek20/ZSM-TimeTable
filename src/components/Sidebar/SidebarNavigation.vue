<script setup>
	import fetchList from '@/functions/fetchList';
	import getCombinations from '@/functions/combinations';
	import log from '@/functions/logger';
	import appData from '@/stores/data';
	import loadSchoolData from '@/functions/loadSchoolData';

	await loadSchoolData();
	await fetchList();
	const user = useRouteParams('user');

	const searchData = computed(() => {
		const classes = [];
		const teachers = [];
		const rooms = [];

		if (Object.keys(appData.value.list).length > 0) {
			appData.value.list.classes.forEach((item) => {
				const out = {};
				out.name = appData.value.parsed.classes[item.name].sidebar;
				out.id = item.value;
				out.keys = appData.value.parsed.classes[item.name].search;
				classes.push(out);
			});
			appData.value.list.teachers.forEach((item) => {
				const out = {};
				out.name = appData.value.parsed.teachers[item.name].sidebar;
				out.id = item.value;
				out.keys = appData.value.parsed.teachers[item.name].search;
				teachers.push(out);
			});
			appData.value.list.rooms.forEach((item) => {
				const out = {};
				out.name = appData.value.parsed.rooms[item.name].sidebar;
				out.id = item.value;
				out.keys = appData.value.parsed.rooms[item.name].search;
				rooms.push(out);
			});
		}

		return { classes, teachers, rooms };
	});
	const classSearcher = computed(() => {
		return createFuzzySearch(searchData.value.classes, {
			getText: (item) => getCombinations(item.keys),
			strategy: 'aggressive',
		});
	});
	const teacherSearcher = computed(() => {
		return createFuzzySearch(searchData.value.teachers, {
			getText: (item) => getCombinations(item.keys),
			strategy: 'aggressive',
		});
	});
	const roomSearcher = computed(() => {
		return createFuzzySearch(searchData.value.rooms, {
			getText: (item) => getCombinations(item.keys),
			strategy: 'aggressive',
		});
	});

	const search = ref({
		text: '',
		query: '',
	});
	const results = computed(() => {
		if (search.value.query.length == 0)
			return {
				classes: searchData.value.classes,
				teachers: user.value == 'uczen' ? [] : searchData.value.teachers,
				rooms: searchData.value.rooms,
			};

		log('info', 'Searching for:', search.value.query);
		const out = {
			classes: classSearcher.value(search.value.query).map((item) => ({ ...item.item })),
			teachers: user.value == 'uczen' ? [] : teacherSearcher.value(search.value.query).map((item) => ({ ...item.item })),
			rooms: roomSearcher.value(search.value.query).map((item) => ({ ...item.item })),
		};
		return out;
	});
</script>

<template>
	<div class="list">
		<MenuSearchBar v-model="search" />
		<SidebarLists :links="results" :query="search.text" />
	</div>
</template>

<style lang="scss" scoped>
	.list {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 0.5rem;
		font-size: 20px;
		min-height: 100%;
	}
</style>
