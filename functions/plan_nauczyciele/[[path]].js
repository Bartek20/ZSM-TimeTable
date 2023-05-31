async function getFile(url) {
  const res = await fetch(url);
  return await res.text();
}

export async function onRequest(context) {
  return new Response(await getFile(`https://zsm.resman.pl/plan_nauczyciele/${context.params.path.join('/')}`), {
    headers: {
      'Access-Control-Allow-Origin': 'https://zsm-timetable.pages.dev',
    },
  });
}
