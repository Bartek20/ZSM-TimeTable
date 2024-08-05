async function getFile(domain, url) {
  const res = await fetch(url);
  const resp = new Response(res.body, res);
  resp.headers.set("Access-Control-Allow-Origin", domain);
  return resp;
}

export async function onRequest(context) {
  return await getFile(
    context.env.CF_PAGES_URL,
    "https://zsm.resman.pl/plan_lekcji/timetableData.js",
  );
}
