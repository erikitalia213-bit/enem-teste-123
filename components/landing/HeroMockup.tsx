import { BookOpen, Home, Library, PenTool, Timer, Users, Watch } from "lucide-react";
import { DiagramSvg } from "@/components/diagram/PlayDiagram";
import { LogoMark } from "@/components/brand/Logo";
import { PLAY_MAP } from "@/data/plays";

/** Mockup del producto construido con componentes reales (sin imágenes). */
export function HeroMockup() {
  const main = PLAY_MAP["pp-03"];
  const minis = [PLAY_MAP["pc-01"], PLAY_MAP["cs-01"], PLAY_MAP["rz-01"], PLAY_MAP["sc-01"], PLAY_MAP["mo-02"], PLAY_MAP["cz-02"]];
  return (
    <div className="relative mx-auto w-full max-w-[640px] lg:max-w-none" aria-hidden="true">
      {/* Glow */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-volt/10 blur-3xl" />

      {/* Ventana de escritorio */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-surface px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto rounded-md bg-ink px-3 py-0.5 text-[0.6rem] text-mist">flaglab5x5.com/app</span>
        </div>
        <div className="grid grid-cols-[46px_1fr] sm:grid-cols-[120px_1fr]">
          <div className="border-r border-white/5 bg-ink/60 p-2">
            <div className="mb-3 flex items-center gap-1.5">
              <LogoMark size={20} />
              <span className="hidden font-display text-xs font-extrabold sm:inline">FLAGLAB</span>
            </div>
            {[Home, PenTool, Library, BookOpen, Timer, Watch, Users].map((Icon, i) => (
              <div key={i} className={`mb-1 flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[0.6rem] ${i === 1 ? "bg-volt/15 text-volt" : "text-mist"}`}>
                <Icon size={12} />
                <span className="hidden sm:inline">{["Inicio", "Crear jugada", "Biblioteca", "Playbook", "Entrenar", "Muñequeras", "Equipo"][i]}</span>
              </div>
            ))}
          </div>
          <div className="p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-widest text-volt">Creador de jugadas</p>
                <p className="font-display text-lg font-extrabold uppercase leading-none sm:text-xl">{main.name}</p>
              </div>
              <span className="rounded-md bg-volt px-2 py-1 text-[0.6rem] font-bold text-ink">Guardar</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="overflow-hidden rounded-lg border border-white/10">
                <DiagramSvg diagram={main.diagram} />
              </div>
              <div className="hidden w-28 space-y-1.5 sm:block">
                {["Go", "Slant", "Out", "Post", "Corner", "Hook"].map((r, i) => (
                  <div key={r} className={`rounded-md border px-2 py-1 text-center text-[0.6rem] font-semibold ${i === 4 ? "border-volt bg-volt/15 text-volt" : "border-white/10 text-mist-2"}`}>
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {minis.map((p) => (
                <div key={p.id} className="overflow-hidden rounded border border-white/10">
                  <DiagramSvg diagram={p.diagram} compact showNotes={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Celular con muñequera */}
      <div className="absolute -bottom-10 -right-2 w-[34%] min-w-[150px] rotate-[4deg] rounded-[1.6rem] border-4 border-[#1c2322] bg-ink p-1.5 shadow-2xl sm:-right-6">
        <div className="rounded-[1.2rem] bg-white p-1.5">
          <p className="mb-1 text-center font-display text-[0.55rem] font-extrabold uppercase text-[#111]">Muñequera · 01-06</p>
          <div className="grid grid-cols-3 gap-[2px] border border-[#111]">
            {minis.map((p, i) => (
              <div key={p.id} className="border border-[#ccc] p-[1px]">
                <p className="font-display text-[0.5rem] font-extrabold leading-none text-[#111]">0{i + 1}</p>
                <DiagramSvg diagram={p.diagram} theme="print" compact showNotes={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
