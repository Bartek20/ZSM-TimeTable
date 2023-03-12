<script setup>
	import AppTimeTable from '@/components/AppTimeTable.vue';
	import { usePlansStore } from '@/stores/plans';
	import { useRoute } from 'vue-router';
	const plansStore = usePlansStore();
	const route = useRoute();
	const mode = route.params.mode;
	const id = route.params.id;
	plansStore.getPlan(mode, id);
</script>

<template>
	<AppTimeTable :print="true" :id="mode+id" />
</template>
