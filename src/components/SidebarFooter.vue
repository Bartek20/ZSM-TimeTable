<script setup>
	import { computed } from 'vue';
	import { useRoute } from 'vue-router'
	import { usePWAStore } from '../stores/pwa';
	import { usePlansStore } from '../stores/plans';
	const route = useRoute()
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
	const dates = computed(() => {
		const obj = plansStore.plans[route.params.mode][route.params.id]
		if (!obj ||
				obj.status == 0 ||
				obj.gen_date == undefined ||
				obj.apply_date == undefined
		) return undefined
		return {
			gen: obj.gen_date,
			apply: obj.apply_date
		}
	})
</script>
<template>
	<footer>
		<div class="app" @click="PWAStore.install" v-if="appStatus == 'installable'"><i class="zsm-download-icon"></i><strong>Zainstaluj Aplikację</strong></div>
		<div class="dates" v-if="dates"><strong>Wygenerowano: </strong><p>{{ dates.gen }}</p><strong>Obowiązuje od: </strong><p>{{ dates.apply }}</p></div>
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
		&.dates {
			background-color: darkslategray;
			font-size: 0.9rem;
			p {
				margin: 0;
			}
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
