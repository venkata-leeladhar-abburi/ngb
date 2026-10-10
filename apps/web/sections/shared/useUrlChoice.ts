"use client";

import { useCallback, useSyncExternalStore } from "react";

import { choiceQuery } from "./urlChoice";

/** Fired after a choice rewrites the URL (replaceState fires no event of its own). */
const URL_CHANGE = "ngb:url-choice";

function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGE, onChange);
  };
}

/**
 * One filter choice kept in the URL (`?result=lost`), so refresh and back work in the Instagram
 * browser. The page stays static: the HTML is rendered for the default, the query is read after
 * hydration and written with history.replaceState (no navigation, no server).
 */
export function useUrlChoice<T extends string>(
  param: string,
  isChoice: (value: string | null) => value is T,
  fallback: T,
): [T, (value: string) => void] {
  const choice = useSyncExternalStore(
    subscribeToHistory,
    () => {
      const value = new URLSearchParams(window.location.search).get(param);
      return isChoice(value) ? value : fallback;
    },
    () => fallback,
  );

  const choose = useCallback(
    (value: string) => {
      if (!isChoice(value)) return;
      const { pathname, search, hash } = window.location;
      const query = choiceQuery(search, param, value === fallback ? null : value);
      window.history.replaceState(null, "", `${pathname}${query}${hash}`);
      window.dispatchEvent(new Event(URL_CHANGE));
    },
    [param, isChoice, fallback],
  );

  return [choice, choose];
}
