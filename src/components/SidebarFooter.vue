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
</script>
<template>
	<footer>
		<div class="app" @click="PWAStore.install" v-if="appStatus == 'installable'"><i class="zsm-download-icon"></i><strong>Zainstaluj Aplikację</strong></div>
		<div class="copy"><i class="zsm-copyright-icon"></i>{{ getFooter() }}<br /><strong>Bartłomiej Radoń</strong></div>
	</footer>
</template>

<style lang="scss">
	footer div {
		width: 100%;
		text-align: center;
		padding: 8px 24px;
		color: white;
		&.app {
			background-color: cadetblue;
		}
		&.copy {
			background-color: teal;
		}
		i {
			padding-right: 5px;
			font-size: 14px;
		}
	}
</style>
