const proxyConfigure = (proxy, _options) => {
	const headings = {
		ERROR: '[PROXY] [ERROR]   ',
		REQUEST: '[PROXY] [REQUEST] ',
		RESPONSE: '[PROXY] [RESPONSE]',
	};
	proxy.on('error', (err, _req, _res) => {
		console.log(headings.ERROR, err);
	});
	proxy.on('proxyReq', (_proxyReq, req, _res) => {
		const method = '[' + req.method + ']'.padEnd(5, ' ');
		console.log(headings.REQUEST, method, req.url);
	});
	proxy.on('proxyRes', (proxyRes, req, _res) => {
		const code = '[' + proxyRes.statusCode + ']'.padEnd(5, ' ');
		console.log(headings.RESPONSE, code, req.url);
	});
};

async function getProxy() {
	const proxy = {};
	let schoolData
	try {
		schoolData = await import('../public/schoolData').default;
		console.log('Setting up PROXY for:', schoolData.schoolTimeTableRootURL);
		proxy[ schoolData.schoolTimeTableRootURL ] = {
			target: schoolData.schoolHomeURL,
			changeOrigin: true,
			secure: false,
			ws: true,
			configure: proxyConfigure,
		}
	} catch (error) { }
	return proxy;
}

export default {
	proxy: await getProxy(),
};
