import appConfigs from '@/stores/configs';
import log from '@/functions/logger';

// Returns true if older, false if newer or equal
function cmpVersion(version) {
	let current_version = (appConfigs.value.version ?? 'v0.0.0').replace('v', '').split('.');
	version = version.replace('v', '').split('.');
	if (current_version[0] < version[0]) return true;
	if (current_version[1] < version[1]) return true;
	if (current_version[2] < version[2]) return true;
	return false;
}

export default async function validateApp() {
	const version = appConfigs.value.version;
	if (version != __APP_VERSION__) {
		log('info', version == undefined ? 'Installing app' : 'Updating app');
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
		// Save new version
		appConfigs.value.version = __APP_VERSION__;
	}
}
