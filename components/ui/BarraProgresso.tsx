export function BarraProgresso({ valor, rotulo, className = "" }: { valor: number; rotulo: string; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, valor)) * 100);
  return (
    <div
      className={`barra-progresso ${className}`}
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
