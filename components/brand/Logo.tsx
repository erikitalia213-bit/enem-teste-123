import { cn } from "@/components/ui";

/** Isotipo de FLAGLAB: una flag de cinturón estilizada sobre una cuadrícula de campo. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#0f2a16" stroke="#49F05A" strokeOpacity="0.35" />
      <path d="M13 8 H28 L23.5 15.5 L28 23 H17 V32 H13 Z" fill="#49F05A" />
      <path d="M17 12 H21" stroke="#0f2a16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={compact ? 28 : 34} />
      <span className="leading-none">
        <span className="block font-display text-[1.35rem] font-extrabold tracking-wide text-snow">
          FLAGLAB <span className="text-volt">5x5</span>
        </span>
      </span>
    </span>
  );
}
