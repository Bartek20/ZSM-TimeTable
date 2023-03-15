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
	plansStore.getPlan(mode, id);
	watch(route, (old_el, new_el) => {
		mode = new_el.params.mode
		id = new_el.params.id
	});
</script>

<template>
	<AppSidebar />
	<AppTimeTable :print="false" :id="mode + id" />
</template>
