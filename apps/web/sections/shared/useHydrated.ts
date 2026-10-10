"use client";

import { useSyncExternalStore } from "react";

// Nothing to listen to: the answer only differs between the server render and the browser.
const subscribe = () => () => undefined;

/** False on the server and during hydration, true after: for values only the browser knows (the URL). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
