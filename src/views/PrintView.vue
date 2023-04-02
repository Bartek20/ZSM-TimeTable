<script setup>
	import AppTimeTable from '@/components/AppTimeTable.vue';
	import { usePlansStore } from '@/stores/plans';
	import { useRoute } from 'vue-router';
	const plansStore = usePlansStore();
	const route = useRoute();
	const mode = route.params.mode;
	const id = route.params.id;
	await plansStore.loadPlan(mode, id);
</script>

<template>
	<AppTimeTable :print="true" :mode="mode" :id="id" :key="mode + id" />
</template>
