import { createRouter } from "../server/routes.mjs";

const ORIGIN = process.env.CORS_ORIGIN || "*";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; if (raw.length > 1e6) req.destroy(); });
    req.on("end", () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { resolve({}); }
    });
    req.on("error", () => resolve({}));
  });
}

async function run(res, handler) {
  try {
    sendJson(res, 200, await handler());
  } catch (err) {
    const status = err.soapFault ? 400 : err.statusCode || 502;
    console.error(`[BFF] Error ${status}: ${err.message}`);
    sendJson(res, status, { error: err.message });
  }
}

const oasis = await import("../server/oasis.mjs");
const db = await import("../server/db.mjs");

const { routes, paramRoutes } = createRouter(oasis, db, [
  ...(!process.env.OASIS_USER || !process.env.OASIS_PASS ? ["Falta OASIS_USER / OASIS_PASS"] : []),
  ...(!process.env.OASIS_BASE ? ["Falta OASIS_BASE — se usará http://swoasis.espoch.edu.ec/OASis/OAS_Interop"] : []),
]);

if (db.enabled) {
  try {
    await db.ensureSchema();
    console.log("[BFF] Supabase: conectado y esquema listo.");
  } catch (err) {
    console.error("[BFF] Supabase: no se pudo inicializar:", err.message);
  }
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }
  const url = new URL(req.url, "http://localhost");
  const key = req.method + " " + url.pathname;
  const handler = routes[key];

  if (!handler) {
    let matched = false;
    for (const pr of paramRoutes) {
      if (pr.route.method !== req.method) continue;
      const m = url.pathname.match(pr.route.regex);
      if (m) {
        const params = {};
        pr.route.paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
        const hasBody = req.method === "POST" || req.method === "PUT";
        const arg = hasBody ? await readJsonBody(req) : Object.fromEntries(url.searchParams.entries());
        await run(res, () => pr.handler(arg, params));
        matched = true;
        break;
      }
    }
    if (!matched) sendJson(res, 404, { error: "Recurso no encontrado: " + key });
    return;
  }

  const hasBody = req.method === "POST" || req.method === "PUT";
  const arg = hasBody ? await readJsonBody(req) : Object.fromEntries(url.searchParams.entries());
  await run(res, () => handler(arg));
}
