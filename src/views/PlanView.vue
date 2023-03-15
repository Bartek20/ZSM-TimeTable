<script setup>
	import AppSidebar from '@/components/AppSidebar.vue';
	import AppTimeTable from '@/components/AppTimeTable.vue';
	import { usePlansStore } from '@/stores/plans';
	import { watch } from 'vue';
	import { useRoute } from 'vue-router';
	const plansStore = usePlansStore();
	const route = useRoute();
	var mode = route.params.mode;
	var id = route.params.id;
	await plansStore.getPlan(mode, id);
	await plansStore.getList();
	watch(route, (_, data) => {
		mode = data.params.mode;
		id = data.params.id;
	});
</script>

<template>
	<AppSidebar />
	<AppTimeTable :print="false" :id="mode + id" />
</template>
