async function getFile(url) {
  return await fetch(url);
}

export async function onRequest(context) {
  const res = await getFile(`https://zsm.resman.pl/plan_nauczyciele/${context.params.path.join('/')}`);
  res.headers.set('Access-Control-Allow-Origin', 'https://zsm-timetable.pages.dev');
  return res;
}
