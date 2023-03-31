<script setup>
	import AppSidebar from '@/components/AppSidebar.vue';
	import AppTimeTable from '@/components/AppTimeTable.vue';
	import { usePlansStore } from '@/stores/plans';
	import sleep from '../functions/sleep';
	import { watch } from 'vue';
	import { useRoute } from 'vue-router';
	const plansStore = usePlansStore();
	const route = useRoute();
	var mode = route.params.mode;
	var id = route.params.id;
	await plansStore.loadList();
	await plansStore.loadPlan(mode, id);
	watch(route, (_, data) => {
		mode = data.params.mode;
		id = data.params.id;
	});
	async function load() {
		await sleep(10000);
		plansStore.getTimeTable();
	};
	load()
</script>

<template>
	<AppSidebar />
	<AppTimeTable :print="false" :id="mode + id" />
</template>
