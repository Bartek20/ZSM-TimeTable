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
	<div>
		<div class="searchbar">
			<i></i>
			<input @input="parseInput" placeholder="Wyszukaj..." type="text" />
		</div>
		<SidebarLinks :links="results" />
	</div>
</template>

<style lang="scss" scoped>
	.searchbar {
		position: relative;
		margin-inline: 0.75rem;
		i {
			position: absolute;
			top: 0;
			left: 0;
			background-color: red;
			width: 20px;
			height: 100%;
		}
		input {
			width: 100%;
			padding: 0.5rem 1rem;
			margin: 0;
		}
	}
	menu {
		overflow: hidden auto;
		scrollbar-gutter: stable;
		$scroll-clr: #0c1e35;
		&::-webkit-scrollbar-thumb {
			border-radius: 4px;
			&:hover {
				background-color: lighten($scroll-clr, 15);
			}
		}
		&::-webkit-scrollbar {
			width: 6px;
			background-color: $scroll-clr;
		}
	}
</style>
