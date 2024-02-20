async function getFile(url) {
	const res = await fetch(url);
	const resp = new Response(res.body, res);
	resp.headers.set('Access-Control-Allow-Origin', env.CF_PAGES_URL);
	return resp;
}

export async function onRequest(_context) {
	return await getFile(`https://zsm.resman.pl/plan_lekcji/timetableData.js`);
}
