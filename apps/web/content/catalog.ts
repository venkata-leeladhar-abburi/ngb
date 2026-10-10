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

export type ProgramPlace = "gym" | "home" | "both";

export interface Program {
  slug: ProgramSlug;
  /** Brand name, the same in English and Telugu. */
  name: string;
  weeks: number;
  /** Rupees, one-time. [CONFIRM] */
  priceInr: number;
  /** The one "Most popular" card ("if the poll agrees", home.md §9). */
  featured: boolean;
  /** Training days a week (pages.md, program variants). A range for Shred 12, so text. */
  daysPerWeek: string;
  /** Minutes a session (pages.md, program variants). */
  minutes: number;
  /**
   * Where the main plan is trained. pages.md states it for Foundation Plan and Master the Bodyweight
   * only; "gym" for the other two is read from screen B1. [CONFIRM]
   */
  place: ProgramPlace;
  /** Made for a first plan (pages.md: "Never trained? Start here."). */
  beginner: boolean;
  /** home.md §10: every plan has a hostel version. */
  hostel: boolean;
}

/** In the order home.md §9 lists them. */
export const programs: readonly Program[] = [
  {
    slug: "foundation-plan",
    name: "Foundation Plan",
    weeks: 8,
    priceInr: 1499,
    featured: false,
    daysPerWeek: "3",
    minutes: 40,
    place: "both",
    beginner: true,
    hostel: true,
  },
  {
    slug: "shred-12",
    name: "Shred 12",
    weeks: 12,
    priceInr: 1999,
    featured: true,
    daysPerWeek: "4-5",
    minutes: 45,
    place: "gym",
    beginner: false,
    hostel: true,
  },
  {
    slug: "mass-builder",
    name: "Mass Builder",
    weeks: 12,
    priceInr: 1999,
    featured: false,
    daysPerWeek: "4",
    minutes: 60,
    place: "gym",
    beginner: false,
    hostel: true,
  },
  {
    slug: "master-the-bodyweight",
    name: "Master the Bodyweight",
    weeks: 12,
    priceInr: 1499,
    featured: false,
    daysPerWeek: "4",
    minutes: 45,
    place: "home",
    beginner: false,
    hostel: true,
  },
];

/**
 * NGB Evolve Club and 1:1 Coaching prices (pages.md), in rupees. All [CONFIRM]: the pricing decision
 * is still open, and checkout (Phase 7) reads its own prices from the server.
 */
export const club = { monthlyInr: 499, yearlyInr: 3999 } as const;
export const coaching = { priceInr: 9999, weeks: 12 } as const;

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

/**
 * Proof strip numbers (home.md §2), in order; the labels are copy. 1M+ is [CONFIRM]. "Members coached"
 * is [REAL DATA]: it joins this list only when a real, provable figure exists.
 */
export const proofStats = [
  { value: 1_000_000, compact: true, suffix: "+" },
  { value: 2022, countUp: false },
  { value: 100, suffix: "%" },
] as const;
