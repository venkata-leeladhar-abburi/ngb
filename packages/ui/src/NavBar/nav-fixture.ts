import type { SiteNavProps } from "./NavBar";

/** Handoff section 6 navigation, for stories and tests. */
export const navFixture: SiteNavProps = {
  homeHref: "#home",
  links: [
    { href: "#programs", label: "Programs" },
    { href: "#tools", label: "Free tools" },
    { href: "#workouts", label: "Workouts" },
    { href: "#transformations", label: "Transformations" },
    { href: "#about", label: "About" },
  ],
  lang: { current: "en", enHref: "#en", teHref: "#te" },
  cta: { href: "#start", label: "Start my plan" },
};
