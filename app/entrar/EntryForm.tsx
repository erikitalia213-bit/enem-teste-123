"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button, Field } from "@/components/ui";
import { ACCESS_CODE } from "@/config";
import { useProfile } from "@/lib/hooks";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { PLAY_MAP } from "@/data/plays";

export function EntryForm() {
  const router = useRouter();
  const { profile, setProfile, hydrated } = useProfile();
  const [coachName, setCoachName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && profile) router.replace("/app/");
  }, [hydrated, profile, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachName.trim()) {
      setError("Escribe tu nombre para continuar.");
      return;
    }
    if (ACCESS_CODE && code.trim().toUpperCase() !== ACCESS_CODE.toUpperCase()) {
      setError("El código de acceso no es correcto. Revísalo en tu correo de compra.");
      return;
    }
    setProfile({ coachName: coachName.trim(), teamName: teamName.trim(), createdAt: Date.now() });
    router.push("/app/");
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-line bg-pitch-2 lg:block">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-2xl border border-volt/25 shadow-[var(--shadow-glow)]">
              <PlayDiagram diagram={PLAY_MAP["pp-03"].diagram} title="Poste-Esquina" />
            </div>
          </div>
          <p className="h-display text-5xl">
            Tu sistema de coaching
            <br />
            <span className="text-volt">en un solo lugar.</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <form onSubmit={submit} className="w-full max-w-md" noValidate>
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <p className="eyebrow">Bienvenido, coach</p>
          <h1 className="h-display mt-1 text-5xl">Entra a FLAGLAB</h1>
          <p className="mt-3 text-mist-2">Personaliza tu espacio. Tus jugadas, playbooks y entrenamientos se guardan en este dispositivo.</p>

          <div className="mt-8 space-y-4">
            <Field label="Tu nombre">
              {(id) => <input id={id} className="input h-12" autoComplete="name" placeholder="Ej. Coach Daniel" value={coachName} onChange={(e) => setCoachName(e.target.value)} required />}
            </Field>
            <Field label="Nombre de tu equipo (opcional)">
              {(id) => <input id={id} className="input h-12" placeholder="Ej. Halcones Sub-12" value={teamName} onChange={(e) => setTeamName(e.target.value)} />}
            </Field>
            {ACCESS_CODE && (
              <Field label="Código de acceso" hint="Lo encuentras en el correo de confirmación de tu compra.">
                {(id) => (
                  <div className="relative">
                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
                    <input id={id} className="input h-12 pl-9 uppercase" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" />
                  </div>
                )}
              </Field>
            )}
            {error && (
              <p role="alert" className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full">
              Entrar a mi espacio <ArrowRight size={18} />
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-mist">
            ¿Aún no tienes FLAGLAB?{" "}
            <Link href="/" className="font-semibold text-volt hover:underline">
              Conócelo aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
