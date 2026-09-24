/* Servidor falso de Supabase (Auth + REST mínimos) para probar el build de producción
 * sin un proyecto real. Imita: login con contraseña, /auth/v1/user, logout,
 * SELECT de entitlements con RLS (solo filas del usuario), RPC grant/revoke y
 * upsert idempotente de webhook_events. NO es seguridad real: solo pruebas. */
import http from "node:http";

const PORT = Number(process.env.MOCK_PORT || 54321);
const SERVICE_KEY = "service-role-test-key";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

const users = new Map(); // email -> { id, email, password, confirmed, meta }
const add = (email, password, confirmed = true, meta = {}) => users.set(email, { id: crypto.randomUUID(), email, password, confirmed, meta });
add("core@test.mx", "clave-segura-1", true, { coach_name: "Coach Core", team_name: "Halcones" });
add("nada@test.mx", "clave-segura-1", true, { coach_name: "Sin Compra" });
add("todo@test.mx", "clave-segura-1", true, { coach_name: "Coach Todo" });

const entitlements = []; // { email, product, status, source, order, user_id }
const webhookEvents = new Set();
const grant = (email, product, source, order) => {
  email = email.toLowerCase();
  const u = users.get(email);
  const row = entitlements.find((e) => e.source === source && e.order === order && e.product === product);
  const uid = u && u.confirmed ? u.id : null;
  if (row) Object.assign(row, { status: "active", email, user_id: uid ?? row.user_id });
  else entitlements.push({ email, product, status: "active", source, order, user_id: uid });
};
grant("core@test.mx", "core_flaglab", "manual", "seed-1");
for (const p of ["core_flaglab", "defensive_playbook", "extra_trainings", "school_coach_kit"]) grant("todo@test.mx", p, "manual", "seed-2");

const tokens = new Map(); // token -> email
function session(u) {
  const now = Math.floor(Date.now() / 1000);
  const access = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: u.id, email: u.email, role: "authenticated", aud: "authenticated", exp: now + 3600, iat: now, session_id: crypto.randomUUID() })}.sig`;
  tokens.set(access, u.email);
  return { access_token: access, token_type: "bearer", expires_in: 3600, expires_at: now + 3600, refresh_token: crypto.randomUUID(), user: userJson(u) };
}
const userJson = (u) => ({ id: u.id, aud: "authenticated", role: "authenticated", email: u.email, email_confirmed_at: u.confirmed ? new Date().toISOString() : null, user_metadata: u.meta, app_metadata: { provider: "email" }, created_at: new Date().toISOString() });

const refresh = new Map();
const send = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" });
  res.end(body === undefined ? "" : JSON.stringify(body));
};

http
  .createServer(async (req, res) => {
    if (req.method === "OPTIONS") return send(res, 204);
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let raw = "";
    for await (const c of req) raw += c;
    const body = raw ? JSON.parse(raw) : {};
    const bearer = (req.headers.authorization || "").replace(/^Bearer /, "");
    const log = (...a) => process.env.MOCK_VERBOSE && console.log(req.method, url.pathname + url.search, ...a);
    log();

    // ---- Auth ----
    if (url.pathname === "/auth/v1/token" && url.searchParams.get("grant_type") === "password") {
      const u = users.get(String(body.email).toLowerCase());
      if (!u || u.password !== body.password) return send(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials", code: "invalid_credentials", msg: "Invalid login credentials" });
      if (!u.confirmed) return send(res, 400, { error: "invalid_grant", code: "email_not_confirmed", msg: "Email not confirmed" });
      const s = session(u);
      refresh.set(s.refresh_token, u.email);
      return send(res, 200, s);
    }
    if (url.pathname === "/auth/v1/token" && url.searchParams.get("grant_type") === "refresh_token") {
      const email = refresh.get(body.refresh_token);
      if (!email) return send(res, 400, { code: "refresh_token_not_found", msg: "Invalid Refresh Token" });
      const s = session(users.get(email));
      refresh.set(s.refresh_token, email);
      return send(res, 200, s);
    }
    if (url.pathname === "/auth/v1/user" && req.method === "GET") {
      const email = tokens.get(bearer);
      if (!email) return send(res, 401, { code: "bad_jwt", msg: "invalid JWT" });
      return send(res, 200, userJson(users.get(email)));
    }
    if (url.pathname === "/auth/v1/logout") {
      tokens.delete(bearer);
      return send(res, 204);
    }
    if (url.pathname === "/auth/v1/signup") {
      const email = String(body.email).toLowerCase();
      if (users.has(email)) return send(res, 422, { code: "user_already_exists", msg: "User already registered" });
      add(email, body.password, false, body.data || {});
      return send(res, 200, userJson(users.get(email)));
    }
    if (url.pathname === "/auth/v1/otp" || url.pathname === "/auth/v1/recover") return send(res, 200, {});

    // ---- REST ----
    const isService = bearer === SERVICE_KEY;
    if (url.pathname === "/rest/v1/entitlements" && req.method === "GET") {
      const email = tokens.get(bearer);
      if (!email) return send(res, 200, []);
      const uid = users.get(email).id;
      const status = (url.searchParams.get("status") || "").replace("eq.", "");
      return send(res, 200, entitlements.filter((e) => e.user_id === uid && (!status || e.status === status)).map((e) => ({ product: e.product })));
    }
    if (url.pathname === "/rest/v1/rpc/grant_entitlement") {
      if (!isService) return send(res, 401, { message: "permission denied" });
      grant(body.p_email, body.p_product, body.p_source, body.p_order);
      return send(res, 200, null);
    }
    if (url.pathname === "/rest/v1/rpc/revoke_entitlement") {
      if (!isService) return send(res, 401, { message: "permission denied" });
      let n = 0;
      for (const e of entitlements) if (e.source === body.p_source && e.order === body.p_order && (!body.p_product || e.product === body.p_product)) {
        e.status = "revoked";
        n++;
      }
      return send(res, 200, n);
    }
    if (url.pathname === "/rest/v1/webhook_events" && req.method === "POST") {
      if (!isService) return send(res, 401, { message: "permission denied" });
      const rows = Array.isArray(body) ? body : [body];
      const out = [];
      for (const r of rows) {
        const k = `${r.provider}:${r.event_id}`;
        if (webhookEvents.has(k)) continue;
        webhookEvents.add(k);
        out.push({ id: webhookEvents.size });
      }
      return send(res, 201, out);
    }
    if (url.pathname === "/__state") return send(res, 200, { entitlements, events: [...webhookEvents] });
    send(res, 404, { message: `mock: ruta no soportada ${url.pathname}` });
  })
  .listen(PORT, () => console.log(`mock supabase en http://127.0.0.1:${PORT}`));
