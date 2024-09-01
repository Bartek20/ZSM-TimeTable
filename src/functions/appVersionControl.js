import appConfigs from '@/stores/configs';
import appData from '@/stores/data';
import log from '@/functions/logger';

// Returns true if older, false if newer or equal
function cmpVersion(version = __APP_VERSION__) {
	const current_version = (appConfigs.value.app.version ?? appConfigs.value.version ?? 'v0.0.0').replace('v', '').split('.');
	version = version.replace('v', '').split('.');
	if (current_version[0] < version[0]) return true;
	if (current_version[0] === version[0] && current_version[1] < version[1]) {
		return true;
	}
	return current_version[0] === version[0] && current_version[1] === version[1] && current_version[2] < version[2];
}

// Function to move settings from old path to new path (appConfigs)
function moveConfigs(type, name) {
	if (appConfigs.value[name] === undefined) return;
	appConfigs.value[type][name] = appConfigs.value[name];
	appConfigs.value[name] = undefined;
}

export default async function validateApp() {
	const version = appConfigs.value.app?.version ?? appConfigs.value.version;
	if (version !== __APP_VERSION__) {
		log('info', '[App]', version === undefined ? 'Instalowanie aplikacji' : 'Aktualizacja aplikacji');
		// Updating from legacy NO-VERSION app to v1.0.0
		if (cmpVersion('v1.0.0')) {
			window.localStorage.removeItem('selectedTimeTable');
			window.localStorage.removeItem('lastFetched');
		}
		// Updating from v1.0.0 to v2.0.0
		if (cmpVersion('v2.0.0')) {
			window.localStorage.removeItem('schoolData');
			window.localStorage.removeItem('timetableData');
			await window.caches.delete('timetables-data');
			appConfigs.value.lastFetched = null;
		}
		// Updating from v2.0.0 to v3.0.0
		if (cmpVersion('v3.0.0')) {
			if (appData.value) appData.value.parsed = undefined;
		}
		// Updating from v3.0.0 to v3.0.1
		if (cmpVersion('v3.0.1')) {
			window.localStorage.removeItem('lists');
			window.localStorage.removeItem('plan');
		}
		// Updating from v3.0.1 to v3.1.0
		if (cmpVersion('v3.1.0')) {
			window.localStorage.removeItem('appData');
			await window.caches.delete('google-fonts-cache');
			await window.caches.delete('gstatic-fonts-cache');
		}
		// Updating from v3.1.0 to v3.1.1
		if (cmpVersion('v3.1.1')) {
			appConfigs.value.currentTimeTable = undefined;
		}
		// Updating from v3.1.1 to v3.1.2
		if (cmpVersion('v3.1.2')) {
			appConfigs.value.database.teachers = {};
		}
		// Updating from v3.1.2 to v3.1.3
		if (cmpVersion('v3.1.3')) {
			await window.caches.delete('fonts-data');
		}
		// Updating from v3.1.5 to v3.2.0
		if (cmpVersion('v3.2.0')) {
			// Move App Configs to separate section
			moveConfigs('app', 'version');
			moveConfigs('app', 'lastFetched');
			moveConfigs('app', 'isTeacher');

			// Move User Configs to separate section
			moveConfigs('user', 'colorMode');
			moveConfigs('user', 'viewMode');
			moveConfigs('user', 'forceTablet');
			moveConfigs('user', 'shortLessons');
			moveConfigs('user', 'showCurrent');
			moveConfigs('user', 'showColors');
			moveConfigs('user', 'showBreaks');
		}
		// Save new version
		appConfigs.value.app.version = __APP_VERSION__;
	}
}
