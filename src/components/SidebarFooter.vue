<script setup>
	import { computed } from 'vue';
	import { usePWAStore } from '../stores/pwa';
	import { usePlansStore } from '../stores/plans';
	const PWAStore = usePWAStore();
	const plansStore = usePlansStore();
	function getFooter() {
		const date = new Date().getFullYear();
		var result = '2023';
		if (date != '2023') {
			result = result + ' - ' + date;
		}
		return result;
	}
	const appStatus = computed(() => PWAStore.status());
	const appLoad = computed(() => {
		if (PWAStore.load) plansStore.getTimeTable();
		return true;
	});
</script>
<template>
	<footer>
		<div class="app px-4 py-2 text-center w-100" @click="PWAStore.install" v-if="appLoad && appStatus">
			<i class="zsm-download-icon"></i><strong>Zainstaluj Aplikację</strong>
		</div>
		<div class="footer px-4 py-2 text-center w-100"><i class="zsm-copyright-icon"></i>{{ getFooter() }}<br /><strong>Bartłomiej Radoń</strong></div>
	</footer>
</template>

<style lang="scss">
	footer div {
		&.app {
			background-color: cadetblue;
		}
		&.footer {
			background-color: teal;
		}
		i {
			padding-right: 5px;
			font-size: 14px;
		}
	}
</style>
