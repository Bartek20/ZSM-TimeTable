<script setup>
	import AppSidebar from '@/components/AppSidebar.vue';
	import AppTimeTable from '@/components/AppTimeTable.vue';
	import { usePlansStore } from '@/stores/plans';
	import getCookie from '@/functions/getCookie';
	const plansStore = usePlansStore();
	plansStore.selected = getCookie('selectedTimeTable');
	if (plansStore.selected == undefined) plansStore.setTimeTable('o', '1');
	const mode = plansStore.selected.charAt(0);
	const id = plansStore.selected.replace(mode, '');
	await plansStore.getTimeTable();
	await plansStore.loadPlan(mode, id);
</script>

<template>
	<AppSidebar />
	<AppTimeTable />
</template>
