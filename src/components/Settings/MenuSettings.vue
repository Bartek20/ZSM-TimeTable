<script setup>
	import appConfigs from '@/stores/configs';
</script>

<template>
	<div class="settings">
		<span><b>Ustawienia</b></span>
		<SettingsOptions
			:options="[
				{ class: 'zsm-old-timetable-icon', value: 'system', name: 'System' },
				{ class: 'zsm-old-timetable-icon', value: 'light', name: 'Jasny' },
				{ class: 'zsm-old-timetable-icon', value: 'dark', name: 'Ciemny' },
			]"
			v-model="appConfigs.colorMode" />
		<SettingsOption icon="zsm-old-timetable-icon" name="Wymuś tryb komputerowy" v-model="appConfigs.forceTablet" />
		<SettingsOption icon="zsm-old-timetable-icon" name="Pokazuj przerwy" v-model="appConfigs.showBreaks" />
		<SettingsOption icon="zsm-old-timetable-icon" name="Pokazuj kolory lekcji" v-model="appConfigs.showColors" />
	</div>
</template>

<style lang="scss" scoped>
	.settings {
		margin-inline: 0.75rem;
		> span {
			font-size: 1.1rem;
			+ * {
				margin-top: 0.25rem;
			}
		}
		> *:not(span):not(:last-child) {
			margin-bottom: 0.25rem;
		}
	}
</style>
