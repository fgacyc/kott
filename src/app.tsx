import { createClient } from "@supabase/supabase-js";
import {
  type Component,
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Database } from "./lib/database.types";
import toast from "solid-toast";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

async function fetchOrInitRole(fingerprint: string) {
  let resp = await supabase
    .from("role")
    .select()
    .eq("id", fingerprint)
    .maybeSingle();
  if (!resp.data) {
    console.log(`[app] inserting ${fingerprint} into role`);
    resp = await supabase
      .from("role")
      .insert({ id: fingerprint, is_active: true })
      .select()
      .maybeSingle();
  }
  console.log(`[app] fetched ${JSON.stringify(resp.data, null, 2)} from db`);
  return resp.data;
}

const App: Component = () => {
  let interval: NodeJS.Timeout;
  const [fingerprint, setFingerprint] = createSignal<string>();
  const [role, { refetch }] = createResource(fingerprint, fetchOrInitRole);

  onMount(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      setFingerprint(visitorId);
    };
    setFp();

    interval = setInterval(() => {
      console.log(`[app] refetching role...`);
      refetch();
    }, 5000);
  });

  onCleanup(() => {
    clearInterval(interval);
  });

  createEffect(() => {});

  return (
    <main class="py-4 px-8 min-h-screen overflow-x-hidden flex flex-col justify-center items-center">
      <Show when={!!role()} fallback={<div>Loading...</div>}>
        <Show when={!role().role}>
          <div class="text-center">
            Please wait while your role is being allocated...
          </div>
        </Show>
        <Show when={role().role === "light"}>
          <img
            src="images/KOTT_Role_Light_BG.png"
            class="z-0 fixed inset-0 object-cover w-full h-screen"
          />
          <img
            src="images/KOTT_Role_Light_Card.png"
            class="fixed z-10 inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </Show>
        <Show when={role().role === "dark"}>
          <img
            src="images/KOTT_Role_Dark_BG.png"
            class="z-0 fixed inset-0 object-cover w-full h-screen"
          />
          <img
            src="images/KOTT_Role_Dark_Card.png"
            class="fixed z-10 inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </Show>

        <footer
          class={`fixed bottom-4 flex items-center ${!role().role ? "text-muted-foreground/40" : "text-foreground font-semibold"} text-xs`}
        >
          <Show when={!!role()}>
            <div
              class={`w-2 h-2 ${!role().role ? "bg-green-500/40" : "bg-green-500"} rounded-full mr-1.5`}
            />
          </Show>
          <button
            onClick={() => {
              navigator.clipboard.writeText(fingerprint());
              toast("Copied fingerprint to clipboard");
            }}
          >
            {fingerprint()}
          </button>
        </footer>
      </Show>
    </main>
  );
};

export default App;
