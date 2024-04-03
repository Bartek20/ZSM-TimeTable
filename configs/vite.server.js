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
		const method = `[${req.method}]`.padEnd(5, ' ');
		console.log(headings.REQUEST, method, req.url);
	});
	proxy.on('proxyRes', (proxyRes, req, _res) => {
		const code = `[${proxyRes.statusCode}]`.padEnd(5, ' ');
		console.log(headings.RESPONSE, code, req.url);
	});
};

export default {
	proxy: {
		'/plan_vulcan': {
			target: 'https://zsm.resman.pl',
			changeOrigin: true,
			secure: false,
			ws: true,
			configure: proxyConfigure,
		},
		'/timetableData.js': {
			target: 'https://zsm.resman.pl/plan_lekcji',
			changeOrigin: true,
			secure: false,
			ws: true,
			configure: proxyConfigure,
		},
		'/schoolData.js': {
			target: 'https://zsm.resman.pl/plan_lekcji',
			changeOrigin: true,
			secure: false,
			ws: true,
			configure: proxyConfigure,
		},
	},
};
