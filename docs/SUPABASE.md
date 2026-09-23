# Conectar Supabase (opcional)

FLAGLAB funciona sin backend. Si quieres cuentas reales y sincronización entre dispositivos:

## 1. Tabla
```sql
create table public.flaglab_kv (
  user_id uuid references auth.users not null,
  key text not null,
  value jsonb not null,
  updated_at timestamptz default now(),
  primary key (user_id, key)
);
alter table public.flaglab_kv enable row level security;
create policy "own rows" on public.flaglab_kv for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 2. Driver
`lib/storage.ts` expone la interfaz `StorageDriver` (`read`, `write`, `remove`, `keys`) y `setStorageDriver()`.
La estrategia recomendada es **caché local + sincronización**:

```ts
// lib/supabaseDriver.ts (ejemplo)
import { createClient } from "@supabase/supabase-js";
import { setStorageDriver, STORAGE_PREFIX, type StorageDriver } from "./storage";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function enableSupabase(userId: string) {
  const { data } = await supabase.from("flaglab_kv").select("key,value").eq("user_id", userId);
  data?.forEach((r) => localStorage.setItem(STORAGE_PREFIX + r.key, JSON.stringify(r.value)));
  const driver: StorageDriver = {
    read: (k) => localStorage.getItem(STORAGE_PREFIX + k),
    write: (k, v) => {
      localStorage.setItem(STORAGE_PREFIX + k, v);
      void supabase.from("flaglab_kv").upsert({ user_id: userId, key: k, value: JSON.parse(v), updated_at: new Date().toISOString() });
    },
    remove: (k) => {
      localStorage.removeItem(STORAGE_PREFIX + k);
      void supabase.from("flaglab_kv").delete().eq("user_id", userId).eq("key", k);
    },
    keys: () => Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX)).map((k) => k.slice(STORAGE_PREFIX.length)),
  };
  setStorageDriver(driver);
}
```

## 3. Login
Sustituye el formulario de `app/entrar/EntryForm.tsx` por Supabase Auth (magic link por correo es lo más simple para compradores) y llama `enableSupabase(user.id)` al iniciar sesión.
Con login real puedes dejar `ACCESS_CODE` vacío.
