export default async function handler(req, res) {
  const upstream = process.env.BOT_API_URL;
  if (!upstream) return res.status(503).json({ error: "BOT_API_URL is not configured in Vercel." });
  const path = Array.isArray(req.query.path) ? req.query.path.join("/") : String(req.query.path || "");
  if (!path.startsWith("api/") && !path.startsWith("auth/")) return res.status(404).json({ error: "Unknown proxy route." });
  const target = new URL(path.replace(/^\/+/, ""), upstream.replace(/\/+$/, "") + "/");
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path" || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) target.searchParams.append(key, String(item));
  }
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || ["host", "connection", "content-length"].includes(key.toLowerCase())) continue;
    headers.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  let body;
  if (!["GET", "HEAD"].includes(req.method || "GET")) {
    if (req.body !== undefined && req.body !== null) {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      body = Buffer.concat(chunks);
    }
  }
  try {
    const upstreamResponse = await fetch(target, { method: req.method, headers, body, redirect: "manual" });
    res.status(upstreamResponse.status);
    upstreamResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "set-cookie" && key.toLowerCase() !== "transfer-encoding") res.setHeader(key, value);
    });
    const cookies = upstreamResponse.headers.getSetCookie?.() || [];
    if (cookies.length) res.setHeader("Set-Cookie", cookies);
    const data = Buffer.from(await upstreamResponse.arrayBuffer());
    return res.send(data);
  } catch (error) {
    return res.status(502).json({ error: "Could not reach the Discord bot API." });
  }
}
