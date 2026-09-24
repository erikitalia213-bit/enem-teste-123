export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "1 jugada" / "3 jugadas" */
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
