import type { Icon } from "@phosphor-icons/react";
import {
  BarbellIcon,
  CalculatorIcon,
  ChartLineUpIcon,
  DropIcon,
  EggIcon,
  ForkKnifeIcon,
  GaugeIcon,
  PersonSimpleIcon,
} from "@phosphor-icons/react/ssr";

/**
 * The things the site sells and links to, in one place (home.md §6 and §9, handoff §6 sitemap).
 * Prices are [CONFIRM]: the pricing decision is still open. Checkout (Phase 7) must read prices from
 * the server; this file becomes the seed for that data, never a price the browser can send back.
 */

export type ProgramSlug = "foundation-plan" | "shred-12" | "mass-builder" | "master-the-bodyweight";

export interface Program {
  slug: ProgramSlug;
  /** Brand name, the same in English and Telugu. */
  name: string;
  weeks: number;
  /** Rupees, one-time. [CONFIRM] */
  priceInr: number;
  /** The one "Most popular" card ("if the poll agrees", home.md §9). */
  featured: boolean;
}

/** In the order home.md §9 lists them. */
export const programs: readonly Program[] = [
  { slug: "foundation-plan", name: "Foundation Plan", weeks: 8, priceInr: 1499, featured: false },
  { slug: "shred-12", name: "Shred 12", weeks: 12, priceInr: 1999, featured: true },
  { slug: "mass-builder", name: "Mass Builder", weeks: 12, priceInr: 1999, featured: false },
  {
    slug: "master-the-bodyweight",
    name: "Master the Bodyweight",
    weeks: 12,
    priceInr: 1499,
    featured: false,
  },
];

export type ToolSlug =
  | "telugu-plate"
  | "calorie-calculator"
  | "weight-gain"
  | "protein"
  | "bmi"
  | "one-rep-max"
  | "body-fat"
  | "water";

/** The seven small bento tiles, in home.md §6 order; the Telugu Plate is the large tile. */
export const smallTools: readonly { slug: Exclude<ToolSlug, "telugu-plate">; icon: Icon }[] = [
  { slug: "calorie-calculator", icon: CalculatorIcon },
  { slug: "weight-gain", icon: ChartLineUpIcon },
  { slug: "protein", icon: EggIcon },
  { slug: "bmi", icon: GaugeIcon },
  { slug: "one-rep-max", icon: BarbellIcon },
  { slug: "body-fat", icon: PersonSimpleIcon },
  { slug: "water", icon: DropIcon },
];

export const teluguPlateIcon = ForkKnifeIcon;

/** Goal tiles (home.md §5), in order, and the program each one leads to. */
export const goalPrograms: readonly ProgramSlug[] = [
  "mass-builder",
  "shred-12",
  "master-the-bodyweight",
  "foundation-plan",
];

/** Workout group each homepage row links to (home.md §7), in order. */
export const muscleGroups = ["chest", "back", "legs", "arms", "shoulders", "abs", "home"] as const;

/**
 * Follow links (handoff §3). YouTube is confirmed. Instagram has several handles: which one is primary
 * is [CONFIRM]. No WhatsApp channel link exists yet, so that button is not shown until it does.
 */
export const social = {
  instagram: "https://www.instagram.com/nawingoldenboy/",
  youtube: "https://www.youtube.com/@nawingoldenboy",
  whatsapp: null,
} as const satisfies Record<"instagram" | "youtube" | "whatsapp", string | null>;
