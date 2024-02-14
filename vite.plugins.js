import fs from 'fs';
import schoolData from './public/schoolData';
// App Data
const xmlTemplate =
	'<?xml version="1.0" encoding="utf-8"?><browserconfig><msapplication><tile><square70x70logo src="${root}assets/images/mstile-70x70.png"/><square150x150logo src="${root}assets/images/mstile-150x150.png"/><square310x310logo src="${root}assets/images/mstile-310x310.png"/><wide310x150logo src="${root}assets/images/mstile-310x150.png"/><TileColor>#da532c</TileColor></tile></msapplication></browserconfig>';

// Utils
export function getNow() {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: 'Europe/Warsaw',
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).format(new Date());
}
export function getGlobs(pattern) {
	return glob.sync(pattern);
}
export function getBanner(now, file) {
	const filename = file.slice(0, file.lastIndexOf('-'));
	const extension = file.slice(file.lastIndexOf('.'));
	const bannerTemplate = `\n\tCreator: Bartłomiej Radoń (@Bartek20)\n\tFile name: ${filename}${extension}\n\tGenerated: ${now}\n\tApp name: ZSM TimeTable\n`;
	return bannerTemplate;
}

// Plugins
export function parseHTML() {
	return {
		name: 'parseHTML',
		transformIndexHtml(html) {
			const htmlVariables = {
				schoolROOT: schoolData.schoolTimeTableRootURL,
			};
			Object.keys(htmlVariables).forEach((key) => {
				const regex = new RegExp(`%${key}%`, 'g');
				html = html.replace(regex, htmlVariables[key]);
			});
			return html;
		},
	};
}
export function generateBrowserConfigXML() {
	let base;
	return {
		name: 'generateBrowserConfigXML',
		configResolved(config) {
			base = config.base;
		},
		async writeBundle(outputOptions, _) {
			const data = xmlTemplate.replace(/\$\{root\}/g, base);
			try {
				fs.writeFileSync((outputOptions.dir || outputOptions.file) + '/browserconfig.xml', data, 'utf-8');
			} catch (error) {
				console.error('Błąd podczas generowania browserconfig.xml:', error);
			}
		},
	};
}
