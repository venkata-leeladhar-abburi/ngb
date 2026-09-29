import { readFileSync } from "node:fs";

/** A DTCG token group: nested groups and tokens, plus `$` metadata keys. */
export type TokenTree = Record<string, unknown>;

export interface Token {
  $value: unknown;
  $type?: string;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export interface TokenEntry {
  path: string;
  token: Token;
  type: string | undefined;
}

const REFERENCE = /^\{([^}]+)\}$/;

export const isGroup = (value: unknown): value is TokenTree =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isToken = (value: unknown): value is Token => isGroup(value) && "$value" in value;

export function loadTokens(url: URL): TokenTree {
  const parsed: unknown = JSON.parse(readFileSync(url, "utf8"));
  if (!isGroup(parsed)) throw new Error("tokens.json must contain an object");
  return parsed;
}

/** The token at a dotted path, e.g. `color.bg.page`. Throws if it does not exist. */
export function getToken(tree: TokenTree, path: string): Token {
  const node = path
    .split(".")
    .reduce<unknown>((current, key) => (isGroup(current) ? current[key] : undefined), tree);
  if (!isToken(node)) throw new Error(`Unknown token: {${path}}`);
  return node;
}

/** The path inside a `{reference}` string, or undefined for any other value. */
export const referenceOf = (value: unknown): string | undefined =>
  typeof value === "string" ? REFERENCE.exec(value)?.[1] : undefined;

/** Resolves `{references}` recursively, including inside arrays and objects (shadows, gradients). */
export function resolve(tree: TokenTree, value: unknown, seen: readonly string[] = []): unknown {
  const reference = referenceOf(value);
  if (reference !== undefined) {
    if (seen.includes(reference)) {
      throw new Error(`Circular reference: ${[...seen, reference].join(" -> ")}`);
    }
    return resolve(tree, getToken(tree, reference).$value, [...seen, reference]);
  }
  if (Array.isArray(value)) return value.map((item: unknown) => resolve(tree, item, seen));
  if (isGroup(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolve(tree, item, seen)]),
    );
  }
  return value;
}

/** Every token with its dotted path and its `$type` (inherited from the nearest group). */
export function listTokens(
  tree: TokenTree,
  prefix: readonly string[] = [],
  inheritedType?: string,
): TokenEntry[] {
  return Object.entries(tree).flatMap(([key, node]): TokenEntry[] => {
    if (key.startsWith("$") || !isGroup(node)) return [];
    const path = [...prefix, key];
    const ownType = node["$type"];
    const type = typeof ownType === "string" ? ownType : inheritedType;
    if (isToken(node)) return [{ path: path.join("."), token: node, type }];
    return listTokens(node, path, type);
  });
}
