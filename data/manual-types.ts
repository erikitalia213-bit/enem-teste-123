/* Tipos del manual (sin contenido). */
export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "tip"; text: string }
  | { t: "table"; head: string[]; rows: string[][] };

export interface Chapter {
  id: string;
  number: number; // 0 = introducción
  title: string;
  summary: string;
  blocks: Block[];
}
