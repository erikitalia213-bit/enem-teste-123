"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------- Botones ---------------- */

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none select-none whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-volt text-ink hover:bg-[#62f771] active:bg-volt-dim shadow-[0_8px_24px_-10px_rgba(73,240,90,0.6)]",
  secondary: "bg-surface-2 text-snow border border-line-2 hover:border-mist/50 hover:bg-[#1b2322]",
  outline: "border border-volt/60 text-volt hover:bg-volt/10",
  ghost: "text-mist-2 hover:text-snow hover:bg-white/5",
  danger: "bg-[#2a1210] text-[#ff9b85] border border-[#5a2419] hover:bg-[#3a1813]",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-[0.95rem]",
  lg: "h-14 px-6 text-base",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function LinkButton({ variant = "primary", size = "md", className, href, ...props }: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function IconButton({ label, className, children, ...props }: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg text-mist-2 hover:bg-white/5 hover:text-snow transition-colors disabled:opacity-40", className)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Contenedores ---------------- */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("card", className)} {...props} />;
}

export function Badge({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "volt" | "amber" | "coral" | "sky"; className?: string }) {
  const tones = {
    default: "bg-white/5 text-mist-2 border-white/10",
    volt: "bg-volt/10 text-volt border-volt/25",
    amber: "bg-amber/10 text-amber border-amber/25",
    coral: "bg-coral/10 text-coral border-coral/25",
    sky: "bg-sky/10 text-sky border-sky/25",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.72rem] font-semibold", tones[tone], className)}>{children}</span>;
}

export const levelTone = (level: string) => (level === "Principiante" ? "volt" : level === "Intermedio" ? "amber" : "coral") as "volt" | "amber" | "coral";

export function PageHeader({ eyebrow, title, description, actions, className }: { eyebrow?: string; title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h1 className="h-display text-4xl md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-mist-2">{description}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      {icon && <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-volt/10 text-volt">{icon}</div>}
      <h3 className="font-display text-2xl font-bold uppercase">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-mist">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, icon, href }: { label: string; value: ReactNode; icon?: ReactNode; href?: string }) {
  const inner = (
    <>
      <div className="flex items-center justify-between text-mist">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="mt-2 font-display text-4xl font-extrabold leading-none">{value}</div>
    </>
  );
  return href ? (
    <Link href={href} className="card card-hover block p-4">
      {inner}
    </Link>
  ) : (
    <div className="card p-4">{inner}</div>
  );
}

/* ---------------- Formularios ---------------- */

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: (id: string) => ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
    </div>
  );
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-10 rounded-lg border px-3 text-sm font-semibold transition-colors",
              active ? "border-volt bg-volt/15 text-volt" : "border-line-2 bg-ink-2 text-mist-2 hover:border-mist/40 hover:text-snow",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({ open, onClose, title, children, wide = false, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "no-print m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] overflow-hidden rounded-2xl border border-line-2 bg-surface p-0 text-snow shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        wide ? "max-w-5xl" : "max-w-lg",
      )}
    >
      {open && (
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 className="font-display text-2xl font-bold uppercase">{title}</h2>
            <IconButton label="Cerrar" onClick={onClose}>
              <X size={20} />
            </IconButton>
          </div>
          <div className="overflow-y-auto px-5 py-5">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/* ---------------- Toasts ---------------- */

interface ToastItem {
  id: number;
  text: string;
  tone: "ok" | "error";
}
const ToastCtx = createContext<(text: string, tone?: "ok" | "error") => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((text: string, tone: "ok" | "error" = "ok") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="no-print pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "animate-fade-up pointer-events-auto rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-xl",
              t.tone === "ok" ? "border-volt/40 bg-[#0f1f12] text-volt" : "border-coral/40 bg-[#241310] text-coral",
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

/* ---------------- Confirmación ---------------- */

export function useConfirm() {
  return useCallback((message: string) => (typeof window === "undefined" ? false : window.confirm(message)), []);
}
