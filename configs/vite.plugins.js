import fs from 'fs';
import schoolData from '../public/schoolData';

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
		enforce: 'pre',
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
	const xmlTemplate =
		'<?xml version="1.0" encoding="utf-8"?><browserconfig><msapplication><tile><square70x70logo src="${root}assets/images/mstile-70x70.png"/><square150x150logo src="${root}assets/images/mstile-150x150.png"/><square310x310logo src="${root}assets/images/mstile-310x310.png"/><wide310x150logo src="${root}assets/images/mstile-310x150.png"/><TileColor>#da532c</TileColor></tile></msapplication></browserconfig>';
	let base;
	return {
		name: 'generateBrowserConfigXML',
		enforce: 'pre',
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
export function generateHTACCESS() {
	const htaccessTemplate =
		'AddDefaultCharset utf-8\nAddCharset utf-8 .css .js .map .json .xml .webmanifest .txt\n\n<IfModule mod_headers.c>\n\tHeader set Access-Control-Allow-Origin "*"\n\tHeader set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"\n\tHeader set Pragma "no-cache"\n\tHeader set Expires "0"\n</IfModule>\n\n<IfModule mod_rewrite.c>\n\tRewriteEngine On\n\n{rule}\n\n\tRewriteCond %{SERVER_PORT} 80\n\tRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]\n\n\tRewriteCond %{REQUEST_FILENAME} !-f\n\tRewriteCond %{REQUEST_FILENAME} !-d\n\tRewriteRule ^(.*)$ index.html [QSA,L]\n</IfModule>';
	return {
		name: 'generateHTACCESS',
		apply: 'build',
		enforce: 'pre',
		async writeBundle(outputOptions, _) {
			try {
				fs.writeFileSync(
					(outputOptions.dir || outputOptions.file) + '/.htaccess.nonwww',
					htaccessTemplate.replace('{rule}', '\tRewriteCond %{HTTP_HOST} ^www.(.*)$ [NC]\n\tRewriteRule ^(.*)$ https://%1%{REQUEST_URI} [R=301,L]'),
					'utf-8'
				);
				fs.writeFileSync(
					(outputOptions.dir || outputOptions.file) + '/.htaccess.www',
					htaccessTemplate.replace('{rule}', '\tRewriteCond %{HTTP_HOST} !^www. [NC]\n\tRewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]'),
					'utf-8'
				);
			} catch (error) {
				console.error('Błąd podczas generowania .htaccess:', error);
			}
		},
	};
}

export function getCloudflareBeacon() {
	return {
		name: 'getCloudflareBeacon',
		apply: 'build',
		enforce: 'pre',
		transformIndexHtml(html) {
			if (!process.env.CF_BEACON_TOKEN) return html;
			const scriptTag = `<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${process.env.CF_BEACON_TOKEN}"}'></script><!-- End Cloudflare Web Analytics -->`;
			html = html.replace('</body>', `${scriptTag}\n</body>`);
			return html;
		},
	};
}
