<script setup>
	import fetchList from '@/functions/fetchList';
	import getCombinations from '@/functions/combinations';
	import log from '@/functions/console';
	import appData from '@/stores/data';
	import loadSchoolData from '@/functions/loadSchoolData';

	await loadSchoolData();
	await fetchList();
	const user = useRouteParams('user');
	const searchData = computed(() => {
		const classes = [];
		appData.value.list.classes.forEach((item) => {
			const out = {};
			out.name = appData.value.parsed.classes[item.name].sidebar;
			out.id = item.value;
			out.keys = appData.value.parsed.classes[item.name].search;
			classes.push(out);
		});
		const teachers = [];
		appData.value.list.teachers.forEach((item) => {
			const out = {};
			out.name = appData.value.parsed.teachers[item.name].sidebar;
			out.id = item.value;
			out.keys = appData.value.parsed.teachers[item.name].search;
			teachers.push(out);
		});
		const rooms = [];
		appData.value.list.rooms.forEach((item) => {
			const out = {};
			out.name = appData.value.parsed.rooms[item.name].sidebar;
			out.id = item.value;
			out.keys = appData.value.parsed.rooms[item.name].search;
			rooms.push(out);
		});

		return { classes, teachers, rooms };
	});
	const classSearcher = computed(() => {
		return createFuzzySearch(searchData.value.classes, {
			getText: (item) => {
				return getCombinations(item.keys);
			},
			strategy: 'aggressive',
		});
	});
	const teacherSearcher = computed(() => {
		return createFuzzySearch(searchData.value.teachers, {
			getText: (item) => {
				return getCombinations(item.keys);
			},
			strategy: 'aggressive',
		});
	});
	const roomSearcher = computed(() => {
		return createFuzzySearch(searchData.value.rooms, {
			getText: (item) => {
				return getCombinations(item.keys);
			},
			strategy: 'aggressive',
		});
	});

	const search = ref('');
	function parseInput(e) {
		const query = e.target.value.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ -]/g, '');
		const searchQuery = query.trim().toLowerCase();
		search.value = searchQuery == 'nauczyciel' ? '' : searchQuery;
		e.target.value = searchQuery == 'nauczyciel' ? '' : query;
		if (searchQuery == 'nauczyciel') document.getElementById('teleporter')?.click();
	}
	const results = computed(() => {
		if (search.value.length == 0)
			return {
				classes: searchData.value.classes,
				teachers: user.value == 'uczen' ? [] : searchData.value.teachers,
				rooms: searchData.value.rooms,
			};

		log('info', 'Searching for:', search.value);
		const out = {
			classes: classSearcher.value(search.value).map((item) => ({ ...item.item })),
			teachers: user.value == 'uczen' ? [] : teacherSearcher.value(search.value).map((item) => ({ ...item.item })),
			rooms: roomSearcher.value(search.value).map((item) => ({ ...item.item })),
		};
		return out;
	});
</script>

<template>
	<div class="list">
		<label for="search" class="searchbar">
			<i class="zsm-search-icon"></i>
			<input @input="parseInput" placeholder="Szukaj..." type="text" id="search" />
		</label>
		<SidebarLinks :links="results" :query="search" />
	</div>
</template>

<style lang="scss" scoped>
	.list {
		display: grid;
		grid-template-rows: 50px minmax(0, 1fr);
		gap: 0.75rem;
		font-size: 20px;
		min-height: 100%;
	}
	.searchbar { 
		height: 50px;
		margin-inline: 0.75rem;
		background-color: var(--bg-sidebar-hover);
		display: flex;
		align-items: center;
		padding-right: 10px;
		border-radius: 6px;
		i {
			display: block;
			font-size: 20px;
			min-width: 40px;
			cursor: text;
			text-align: center;
		}
		input {
			background-color: var(--bg-sidebar-hover);
			color: var(--sb-text);
			height: 100%;
			width: 100%;
			border-radius: 6px;
			font-size: 1rem;
			outline: none;
			border: none;
		}
	}
</style>
