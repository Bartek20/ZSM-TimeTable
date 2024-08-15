<script setup>
	import appConfigs from '@/stores/configs';
	const search = defineModel({required: true});
	function parseInput(e) {
		const query = e.target.value.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ -]/g, '');
		const searchQuery = query.trim().toLowerCase();
		const outcome = {
			query: searchQuery === 'nauczyciel' ? '' : searchQuery,
			text: searchQuery === 'nauczyciel' ? '' : query,
		};
		search.value = outcome;
		e.target.value = searchQuery === 'nauczyciel' ? '' : query;
		if (searchQuery === 'nauczyciel') {
			appConfigs.value.app.isTeacher = true;
			document.getElementById('teleporter')?.click();
		}
	}
</script>

<template>
	<label for="search" class="searchbar">
		<i class="zsm-search-icon"></i>
		<input @input="parseInput" placeholder="Szukaj..." type="text" id="search" />
	</label>
</template>

<style lang="scss">
	.searchbar {
		height: 40px;
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
