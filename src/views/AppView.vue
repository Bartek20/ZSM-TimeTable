<script setup>
	import AppSidebar from '@/components/AppSidebar.vue';
	import AppTimeTable from '@/components/AppTimeTable.vue';
	import { usePlansStore } from '@/stores/plans';
	import getCookie from '@/functions/getCookie';
	const plansStore = usePlansStore();
	plansStore.selected = getCookie('selectedTimeTable');
	const mode = plansStore.selected.charAt(0);
	const id = plansStore.selected.replace(mode, '');
	plansStore.getPlan(mode, id);
	await plansStore.getTimeTable();
</script>

<template>
	<AppSidebar />
	<AppTimeTable />
</template>
