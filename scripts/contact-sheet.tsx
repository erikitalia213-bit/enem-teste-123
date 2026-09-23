/* Genera una hoja de contacto con todos los diagramas para revisión visual (QA). */
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DiagramSvg } from "../components/diagram/PlayDiagram";
import { PLAYS } from "../data/plays";
(globalThis as unknown as { React: typeof React }).React = React;
const out = process.argv[2] ?? "contact-sheet.html";
const from = Number(process.argv[3] ?? 0);
const to = Number(process.argv[4] ?? PLAYS.length);
const cells = PLAYS.slice(from, to)
  .map((p) => `<div class="c"><b>${p.id} · ${p.name}</b><small>${p.formation} · 1:${p.primaryRead.slice(0, 40)}</small>${renderToStaticMarkup(<DiagramSvg diagram={p.diagram} showNotes />)}</div>`)
  .join("");
fs.writeFileSync(out, `<html><body style="margin:0;background:#070909;color:#fff;font:11px Arial"><style>.g{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;padding:6px}.c b{display:block}.c small{display:block;color:#9da3a3;height:14px;overflow:hidden}svg{width:100%;display:block}</style><div class="g">${cells}</div></body></html>`);
