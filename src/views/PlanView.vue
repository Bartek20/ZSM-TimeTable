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
	watch(route, (_, data) => {
		mode = data.params.mode;
		id = data.params.id;
	});
	async function load() {
		var i = 0;
		while (window.WorkerReady == undefined && i < 600) {
			await sleep(100);
			i++;
		}
		await sleep(1000);
		plansStore.getTimeTable();
	}
	//load();
</script>

<template>
	<AppSidebar />
	<AppTimeTable :print="false" :mode="mode" :id="id" :key="mode + id" />
</template>
