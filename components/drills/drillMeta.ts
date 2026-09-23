import { Activity, Crosshair, Flag, Footprints, Hand, MessageCircle, Shield, Sparkles, Target, Trophy, Wind, Zap, Goal, Heart } from "lucide-react";
import type { DrillCategory } from "@/lib/types";

export const DRILL_META: Record<DrillCategory, { color: string; icon: typeof Activity }> = {
  "Warm-up": { color: "#FFD23F", icon: Sparkles },
  Pase: { color: "#49F05A", icon: Target },
  Recepción: { color: "#5AC8FA", icon: Hand },
  Rutas: { color: "#49F05A", icon: Footprints },
  "Flag pulling": { color: "#FF7A59", icon: Flag },
  Agilidad: { color: "#FF6BD6", icon: Activity },
  Velocidad: { color: "#FFD23F", icon: Wind },
  Ataque: { color: "#49F05A", icon: Zap },
  Defensa: { color: "#FF7A59", icon: Shield },
  Comunicación: { color: "#5AC8FA", icon: MessageCircle },
  QB: { color: "#49F05A", icon: Crosshair },
  "Red Zone": { color: "#FF7A59", icon: Goal },
  Juego: { color: "#FFD23F", icon: Trophy },
  "Vuelta a la calma": { color: "#9DA3A3", icon: Heart },
};
