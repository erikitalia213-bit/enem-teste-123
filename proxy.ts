import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (antigo middleware): renova a sessão do Supabase e manda quem não está
 * logada para /login. A checagem de COMPRA aprovada acontece no servidor
 * (lib/sessao.ts), em toda página da área logada.
 */
const ROTAS_PROTEGIDAS = ["/hoje", "/treino", "/jornada", "/cardapio", "/biblioteca", "/exercicios", "/perfil", "/onboarding", "/acesso-bloqueado"];

function protegida(caminho: string) {
  return ROTAS_PROTEGIDAS.some((r) => caminho === r || caminho.startsWith(`${r}/`));
}

function paraLogin(request: NextRequest) {
  const destino = request.nextUrl.clone();
  destino.pathname = "/login";
  destino.search = "";
  return NextResponse.redirect(destino);
}

export async function proxy(request: NextRequest) {
  const caminho = request.nextUrl.pathname;

  // Modo de teste E2E (nunca na Vercel): sessão por cookie simples.
  if (process.env.MODO_TESTE_E2E === "1" && !process.env.VERCEL) {
    if (protegida(caminho) && !request.cookies.get("p42_e2e_sessao")) return paraLogin(request);
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return protegida(caminho) ? paraLogin(request) : NextResponse.next();

  let resposta = NextResponse.next({ request });
  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user && protegida(caminho)) return paraLogin(request);
  if (data.user && caminho === "/login") {
    const destino = request.nextUrl.clone();
    destino.pathname = "/hoje";
    destino.search = "";
    return NextResponse.redirect(destino);
  }
  return resposta;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|img/|icones/|sw.js|manifest.webmanifest|favicon.ico|.*\\.(?:png|webp|jpg|svg|ico)$).*)"],
};
