import "server-only";
import { cache } from "react";
import { modoTesteE2E } from "./modo";
import { repositorioMemoria } from "./memoria";
import { repositorioSupabase } from "./supabase";
import type { Repositorio } from "./tipos";

/** Repositório da requisição atual (Supabase, ou memória no modo de teste E2E). */
export const obterRepositorio = cache((): Repositorio => (modoTesteE2E ? repositorioMemoria() : repositorioSupabase()));
