<script setup>
	import appConfigs from '@/stores/configs';
	const user = useRouteParams('user');
</script>

<template>
	<div class="configs__settings">
		<span class="configs__settings__title"><b>Ustawienia</b></span>
		<SettingsSettingGroup
			name="Motyw aplikacji"
			:options="[
				{ class: 'zsm-system-mode-icon', value: 'system', name: 'System' },
				{ class: 'zsm-light-mode-icon', value: 'light', name: 'Jasny' },
				{ class: 'zsm-dark-mode-icon', value: 'dark', name: 'Ciemny' },
			]"
			v-model="appConfigs.colorMode" />
		<SettingsSettingGroup
			v-if="appConfigs.school.allowStudentsOldView || user == 'nauczyciel'"
			name="Wygląd aplikacji"
			:options="[
				{ class: 'zsm-old-mode-icon', value: 'old', name: 'Stary' },
				{ class: 'zsm-new-mode-icon', value: 'new', name: 'Nowy' },
			]"
			v-model="appConfigs.viewMode" />
		<SettingsSetting icon="zsm-forceDesktop-icon" name="Wymuś tryb komputerowy" v-model="appConfigs.forceTablet" />
		<SettingsSetting
			v-if="appConfigs.timetable.shortLessons.length > 0"
			icon="zsm-shortLessons-icon"
			name="Skrócone lekcje"
			v-model="appConfigs.shortLessons" />
		<SettingsSetting
			v-if="appConfigs.viewMode == 'new'"
			icon="zsm-showCurrent-icon"
			name="Pokazuj aktualną lekcję / przerwę"
			v-model="appConfigs.showCurrent" />
		<SettingsSetting icon="zsm-showBreaks-icon" name="Pokazuj przerwy" v-model="appConfigs.showBreaks" />
		<SettingsSetting v-if="appConfigs.viewMode == 'new'" icon="zsm-showColors-icon" name="Pokazuj kolory lekcji" v-model="appConfigs.showColors" />
	</div>
</template>

<style lang="scss">
	.configs__settings {
		margin-inline: 0.75rem;
		&__title {
			font-size: 1.1rem;
			+ * {
				margin-top: 0.25rem;
			}
		}
		> *:not(span):not(label):not(:last-child) {
			margin-bottom: 0.25rem;
		}
	}
</style>
