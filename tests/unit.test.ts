/* Pruebas automáticas de las funciones principales. Ejecuta: npm test */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { buildCheckoutUrl, pickAttribution } from "../lib/checkout";
import { parseProductMap } from "../lib/entitlements";
import { parseHotmart, parseKiwify, verifyHotmart, verifyKiwify } from "../lib/server/webhooks";
import { generateTraining, isSuitable, splitMinutes } from "../lib/generator";
import { buildDiagram, FIELD_H, FIELD_W } from "../lib/field";
import { moveRef } from "../lib/playbook";
import { DRILLS } from "../data/drills";
import { PLAYS } from "../data/plays";
import { AGE_GROUPS, DURATIONS, LEVELS, TRAINING_GOALS, type Playbook } from "../lib/types";

/* ---------- Checkout / atribución ---------- */

test("preserva utm_*, fbclid y no sobrescribe parámetros del link", () => {
  const attr = pickAttribution("?utm_source=facebook&utm_medium=paid&utm_campaign=lanz&utm_content=video1&utm_term=coach&fbclid=ABC123&otro=x");
  assert.deepEqual(Object.keys(attr).sort(), ["fbclid", "utm_campaign", "utm_content", "utm_medium", "utm_source", "utm_term"]);
  const url = new URL(buildCheckoutUrl("https://pay.hotmart.com/X123?off=abc&utm_source=fijo", attr, "hotmart"));
  assert.equal(url.searchParams.get("off"), "abc");
  assert.equal(url.searchParams.get("utm_source"), "fijo", "no sobrescribe");
  assert.equal(url.searchParams.get("utm_campaign"), "lanz");
  assert.equal(url.searchParams.get("fbclid"), "ABC123");
  assert.equal(url.searchParams.get("src"), "facebook");
  assert.equal(url.searchParams.get("sck"), "facebook|paid|lanz|video1");
  assert.equal(url.searchParams.has("otro"), false);
});

test("sin link de checkout manda a #precio; kiwify no agrega src/sck", () => {
  assert.equal(buildCheckoutUrl("", { utm_source: "fb" }), "/#precio");
  const u = new URL(buildCheckoutUrl("https://pay.kiwify.com.br/abc", { utm_source: "fb" }, "kiwify"));
  assert.equal(u.searchParams.get("utm_source"), "fb");
  assert.equal(u.searchParams.has("src"), false);
});

/* ---------- Entitlements / webhooks ---------- */

test("parseProductMap ignora productos desconocidos", () => {
  assert.deepEqual(parseProductMap("111:core_flaglab, 222:defensive_playbook,333:hackeo,:core_flaglab,basura"), { "111": "core_flaglab", "222": "defensive_playbook" });
});

const map = parseProductMap("111:core_flaglab,222:defensive_playbook");
const hotmart = (event: string, productId = 111) => ({
  id: "evt-1",
  event,
  version: "2.0.0",
  data: { product: { id: productId }, buyer: { email: "Coach@Correo.com ", name: "Ana Pérez" }, purchase: { transaction: "HP123", price: { value: 199, currency_value: "MXN" }, origin: { src: "facebook", sck: "fb|paid" } } },
});

test("Hotmart: token, aprobado → grant, reembolso → revoke, producto no mapeado → ignore", () => {
  assert.equal(verifyHotmart("secreto", {}, "secreto"), true);
  assert.equal(verifyHotmart("otro", {}, "secreto"), false);
  assert.equal(verifyHotmart("secreto", {}, undefined), false, "sin secreto configurado se rechaza");
  const ok = parseHotmart(hotmart("PURCHASE_APPROVED"), map)!;
  assert.equal(ok.action, "grant");
  assert.equal(ok.email, "coach@correo.com");
  assert.deepEqual(ok.products, ["core_flaglab"]);
  assert.equal(ok.value, 199);
  assert.equal(ok.tracking.src, "facebook");
  assert.equal(parseHotmart(hotmart("PURCHASE_REFUNDED"), map)!.action, "revoke");
  assert.equal(parseHotmart(hotmart("PURCHASE_CHARGEBACK"), map)!.action, "revoke");
  assert.equal(parseHotmart(hotmart("PURCHASE_BILLET_PRINTED"), map)!.action, "ignore", "boleto impreso no da acceso");
  const unk = parseHotmart(hotmart("PURCHASE_APPROVED", 999), map)!;
  assert.equal(unk.action, "ignore");
  assert.equal(unk.unmappedProductId, "999");
  assert.equal(parseHotmart({ event: "PURCHASE_APPROVED" }, map), null);
});

test("Kiwify: firma HMAC-SHA1, paid → grant, refunded → revoke", () => {
  const body = JSON.stringify({ order_id: "K1", order_status: "paid", webhook_event_type: "order_approved", Product: { product_id: "222" }, Customer: { email: "x@y.mx" }, Commissions: { charge_amount: 7900, currency: "MXN" }, TrackingParameters: { utm_source: "fb", fbclid: "F1" } });
  const sig = createHmac("sha1", "tok").update(body).digest("hex");
  assert.equal(verifyKiwify(body, sig, "tok"), true);
  assert.equal(verifyKiwify(body + " ", sig, "tok"), false);
  assert.equal(verifyKiwify(body, null, "tok"), false);
  const ev = parseKiwify(JSON.parse(body), map)!;
  assert.equal(ev.action, "grant");
  assert.deepEqual(ev.products, ["defensive_playbook"]);
  assert.equal(ev.value, 79);
  assert.equal(ev.tracking.fbclid, "F1");
  assert.equal(parseKiwify({ order_id: "K1", order_status: "refunded", webhook_event_type: "order_refunded", Product: { product_id: "222" } }, map)!.action, "revoke");
  assert.equal(parseKiwify({ order_id: "K1", order_status: "waiting_payment", webhook_event_type: "billet_created", Product: { product_id: "222" } }, map)!.action, "ignore");
});

/* ---------- Generador ---------- */

test("splitMinutes siempre suma exactamente el total", () => {
  for (const total of [30, 45, 60, 75, 90]) for (const w of [[1], [1, 2, 3], [5, 1, 1, 1, 1, 1, 1], [0.1, 9]]) assert.equal(splitMinutes(w, total).reduce((a, b) => a + b, 0), total);
});

test("generador: todas las combinaciones respetan tiempo, edad, nivel y jugadores", () => {
  let n = 0;
  for (const age of AGE_GROUPS)
    for (const level of LEVELS)
      for (const duration of DURATIONS)
        for (const players of [4, 5, 6, 8, 10, 14, 20, 30])
          for (const goal of TRAINING_GOALS) {
            const s = generateTraining({ age, level, duration, players, goal, seed: n }, DRILLS);
            const sum = s.blocks.reduce((a, b) => a + b.minutes, 0);
            assert.equal(sum, duration, `${age}/${level}/${duration}/${players}/${goal} suma ${sum}`);
            assert.ok(s.blocks.every((b) => b.minutes >= 3), "bloques de al menos 3 min");
            for (const b of s.blocks) {
              if (!b.drillId) continue;
              const d = DRILLS.find((x) => x.id === b.drillId)!;
              assert.ok(d.ages.includes(age), `${d.id} no es para ${age}`);
              assert.ok(d.players.min <= players, `${d.id} pide ${d.players.min} jugadores (hay ${players})`);
              assert.ok(LEVELS.indexOf(d.level) - LEVELS.indexOf(level) <= 1, `${d.id} demasiado avanzado`);
            }
            const ids = s.blocks.map((b) => b.drillId).filter(Boolean);
            assert.equal(new Set(ids).size, ids.length, "sin drills repetidos en la sesión");
            n++;
          }
  assert.ok(n > 5000);
});

test("isSuitable excluye drills con más jugadores mínimos de los disponibles", () => {
  const big = DRILLS.find((d) => d.players.min >= 6)!;
  assert.equal(isSuitable(big, { age: big.ages[0], level: big.level, players: big.players.min - 1 }), false);
});

/* ---------- Diagramas / playbook ---------- */

test("todas las jugadas de la biblioteca quedan dentro del campo", () => {
  for (const p of PLAYS)
    for (const r of p.diagram.routes)
      for (const pt of r.points) {
        assert.ok(pt.x >= 0 && pt.x <= FIELD_W && pt.y >= 0 && pt.y <= FIELD_H, `${p.id} fuera del campo`);
      }
});

test("buildDiagram con formación reflejada mantiene rutas dentro del campo", () => {
  const d = buildDiagram({ formation: "trips-right", mirror: true, routes: [{ p: "X", r: "corner" }, { p: "Y", r: "out" }, { p: "Z", r: "go" }] });
  for (const r of d.routes) for (const pt of r.points) assert.ok(pt.x >= 0 && pt.x <= FIELD_W);
});

test("moveRef reordena dentro y entre secciones sin perder jugadas", () => {
  const pb = { id: "p", name: "x", sections: { ofensiva: [{ id: "a", source: "library" }, { id: "b", source: "library" }, { id: "c", source: "library" }], defensiva: [], redzone: [], conversion: [], especiales: [] }, createdAt: 0, updatedAt: 0 } as unknown as Playbook;
  const a = moveRef(pb, { section: "ofensiva" as never, index: 0 }, { section: "ofensiva" as never, index: 3 });
  assert.deepEqual((a.sections as Record<string, { id: string }[]>).ofensiva.map((r) => r.id), ["b", "c", "a"]);
  const b = moveRef(pb, { section: "ofensiva" as never, index: 1 }, { section: "redzone" as never, index: 0 });
  assert.deepEqual((b.sections as Record<string, { id: string }[]>).redzone.map((r) => r.id), ["b"]);
  assert.equal((b.sections as Record<string, unknown[]>).ofensiva.length, 2);
});
