import fs from 'fs';
import path from 'path';
import axios from 'axios';
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
		'<IfModule mod_rewrite.c>\n\tRewriteEngine On\n\n{rule}\n\n\tRewriteCond %{SERVER_PORT} 80\n\tRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]\n\n\tRewriteCond %{REQUEST_FILENAME} !-f\n\tRewriteCond %{REQUEST_FILENAME} !-d\n\tRewriteRule ^(.*)$ index.html [QSA,L]\n</IfModule>';
	return {
		name: 'generateHTACCESS',
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

export function getCloudflareBeacon(TOKEN) {
	const file = 'cf-ins.js';
	let base, outDir;
	let beaconContent;
	return {
		name: 'getCloudflareBeacon',
		enforce: 'pre',
		configResolved(config) {
			base = config.base;
			outDir = config.root + (config.build.outDir.startsWith('/') ? config.build.outDir : '/' + config.build.outDir);
		},
		async buildStart() {
			if (!process.env.CF_PAGES && TOKEN)
				try {
					console.log('Downloading cloudflare beacon script...');
					const res = await axios.get('https://static.cloudflareinsights.com/beacon.min.js');
					beaconContent = res.data;
				} catch (error) {
					console.log('Failed to download cloudflare beacon script:', error);
				}
		},
		transformIndexHtml(html) {
			try {
				if (beaconContent) {
					console.log('Saving beacon file...');
					fs.writeFileSync(outDir + (outDir.endsWith('/') ? file : '/' + file), beaconContent, 'utf-8');
					const scriptTag = `<!-- Cloudflare Web Analytics --><script defer src='${
						base + (base.endsWith('/') ? file : '/' + file)
					}' data-cf-beacon='{"token": "${TOKEN}"}'></script><!-- End Cloudflare Web Analytics -->`;
					html = html.replace('</body>', `${scriptTag}\n</body>`);
					return html;
				}
			} catch (error) {
				console.error('Failed to save beacon file:', error);
			}
		},
	};
}

export function VitePluginDownloadFile(url, outputDir, htmlPath, token) {
	return {
		name: 'vite-plugin-download-file',
		enforce: 'pre',
		async buildStart() {
			console.log(`Downloading file from ${url}...`);
			try {
				await downloadFile(url, outputDir);
				console.log(`File downloaded successfully and saved to ${outputDir}`);

				// Inject script into HTML
				injectScriptIntoHtml(htmlPath, path.basename(url), token);
				console.log(`Script injected into ${htmlPath}`);
			} catch (error) {
				console.error(`Error downloading file: ${error.message}`);
			}
		},
	};
}
