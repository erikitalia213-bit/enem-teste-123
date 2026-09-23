"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Download, LogOut, Save, Smartphone, Trash2, Upload } from "lucide-react";
import { Button, Card, Field, PageHeader, useToast } from "@/components/ui";
import { useProfile, usePlays, usePlaybooks, useTrainings, useRoster, useTracker } from "@/lib/hooks";
import { clearAll, downloadFile, exportAll, importAll } from "@/lib/storage";

export default function AjustesPage() {
  const toast = useToast();
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const counts = [
    ["Jugadas", usePlays().items.length],
    ["Playbooks", usePlaybooks().items.length],
    ["Entrenamientos", useTrainings().items.length],
    ["Jugadores", useRoster().items.length],
    ["Sesiones de tracker", useTracker().items.length],
  ] as const;
  const fileRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  return (
    <div className="animate-fade-up">
      <PageHeader eyebrow="Ajustes" title="Tu espacio" description="Perfil, respaldo de datos y opciones del dispositivo." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h2 className="font-display text-xl font-bold uppercase">Perfil</h2>
          <Field label="Tu nombre">{(id) => <input id={id} className="input" value={profile.coachName} onChange={(e) => setProfile({ ...profile, coachName: e.target.value })} />}</Field>
          <Field label="Nombre del equipo">{(id) => <input id={id} className="input" value={profile.teamName} onChange={(e) => setProfile({ ...profile, teamName: e.target.value })} />}</Field>
          <p className="flex items-center gap-1.5 text-xs text-mist">
            <Save size={13} /> Los cambios se guardan automáticamente.
          </p>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="font-display text-xl font-bold uppercase">Respaldo</h2>
          <p className="text-sm text-mist-2">Tus datos viven en este navegador. Exporta un respaldo para pasarlos a otro dispositivo o guardarlos.</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {counts.map(([label, n]) => (
              <li key={label} className="rounded-lg border border-line bg-ink-2 px-3 py-2">
                <span className="font-display text-2xl font-bold text-volt">{n}</span> <span className="text-mist">{label}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                downloadFile(`flaglab-respaldo-${new Date().toISOString().slice(0, 10)}.json`, exportAll());
                toast("Respaldo descargado");
              }}
            >
              <Download size={17} /> Exportar respaldo
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload size={17} /> Importar respaldo
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const n = importAll(await f.text());
                  toast(`Respaldo importado (${n} secciones)`);
                } catch {
                  toast("Archivo de respaldo no válido", "error");
                }
                e.target.value = "";
              }}
            />
          </div>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
            <Smartphone size={18} className="text-volt" /> Úsalo como app
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-mist-2">
            <li>
              <b className="text-snow">Android (Chrome):</b> menú ⋮ → “Agregar a pantalla principal”.
            </li>
            <li>
              <b className="text-snow">iPhone (Safari):</b> botón Compartir → “Agregar a inicio”.
            </li>
            <li>
              <b className="text-snow">Computadora:</b> ícono de instalar en la barra de direcciones (Chrome/Edge).
            </li>
          </ul>
        </Card>

        <Card className="space-y-3 border-coral/25 p-5">
          <h2 className="font-display text-xl font-bold uppercase text-coral">Zona de cuidado</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setProfile(null);
                router.push("/entrar/");
              }}
            >
              <LogOut size={17} /> Cambiar de coach
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!window.confirm("Se borrarán TODAS tus jugadas, playbooks, entrenamientos, equipo y estadísticas de este dispositivo. ¿Continuar?")) return;
                clearAll();
                router.push("/entrar/");
              }}
            >
              <Trash2 size={17} /> Borrar todos mis datos
            </Button>
          </div>
          <p className="text-xs text-mist">Te recomendamos exportar un respaldo antes de borrar.</p>
        </Card>
      </div>
      <p className="mt-10 text-center text-xs text-mist">FLAGLAB 5x5 es una herramienta educativa independiente. No está afiliada a ninguna liga, federación ni equipo profesional.</p>
    </div>
  );
}
