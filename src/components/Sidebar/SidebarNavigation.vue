<script setup>
	import fetchList from '@/functions/fetchList';
	import getCombinations from '@/functions/combinations';
	import log from '@/functions/logger';
	import parseName from '@/functions/parseName';
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';

	await fetchList();
	const user = useRouteParams('user');

	const searchData = computed(() => {
		const classes = [];
		const teachers = [];
		const rooms = [];

		if (Object.keys(appData.list.value).length > 0) {
			appData.list.value.classes.forEach((item) => {
				const out = {};
				if (!appConfigs.value.database.classes[item.name]) parseName('o', item.name);
				out.name = appConfigs.value.database.classes[item.name].sidebar;
				out.id = item.value;
				out.keys = appConfigs.value.database.classes[item.name].search;
				classes.push(out);
			});
			appData.list.value.teachers.forEach((item) => {
				const out = {};
				if (!appConfigs.value.database.teachers[item.name]) parseName('n', item.name);
				out.name = appConfigs.value.database.teachers[item.name].sidebar;
				out.id = item.value;
				out.keys = appConfigs.value.database.teachers[item.name].search;
				teachers.push(out);
			});
			appData.list.value.rooms.forEach((item) => {
				const out = {};
				if (!appConfigs.value.database.rooms[item.name]) parseName('s', item.name);
				out.name = appConfigs.value.database.rooms[item.name].sidebar;
				out.id = item.value;
				out.keys = appConfigs.value.database.rooms[item.name].search;
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

		log('info', '[App] Wyszukiwanie:', search.value.query);
		const out = {
			classes: classSearcher.value(search.value.query).map((item) => ({ ...item.item })),
			teachers: user.value == 'uczen' ? [] : teacherSearcher.value(search.value.query).map((item) => ({ ...item.item })),
			rooms: roomSearcher.value(search.value.query).map((item) => ({ ...item.item })),
		};
		return out;
	});
</script>

<template>
	<div class="sidebar__list">
		<MenuSearchBar v-if="searchData.classes.length > 0 || searchData.teachers.length > 0 || searchData.rooms.length > 0" v-model="search" />
		<div v-else></div>
		<SidebarLists v-if="searchData.classes.length > 0 || searchData.teachers.length > 0 || searchData.rooms.length > 0" :links="results" :query="search.text" />
		<menu v-else></menu>
	</div>
</template>

<style lang="scss">
	.sidebar__list {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 0.5rem;
		font-size: 20px;
		min-height: 100%;
	}
</style>
