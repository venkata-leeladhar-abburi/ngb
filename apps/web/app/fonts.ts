import localFont from "next/font/local";

// Faces from board 04, subsetted by `pnpm --filter @ngb/web fonts` into fonts/web/.
// Each `variable` matches $extensions.ngb.cssVariable in packages/tokens/src/tokens.json.
// Fallbacks are metric-matched to Arial so text does not shift when the font arrives (CLS).
// Only Rush Driver and GT America Standard are preloaded (ngb-design-system skill).

const rushDriver = localFont({
  src: "../fonts/web/rush-driver-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-rush-driver",
  display: "swap",
  preload: true,
});

const gtCompressed = localFont({
  src: "../fonts/web/gt-america-compressed-black-italic.woff2",
  weight: "900",
  style: "italic",
  variable: "--font-gt-compressed",
  display: "swap",
  preload: false,
});

const gtExtended = localFont({
  src: "../fonts/web/gt-america-extended-bold.woff2",
  weight: "700",
  variable: "--font-gt-extended",
  display: "swap",
  preload: false,
});

const gtStandard = localFont({
  src: [
    { path: "../fonts/web/gt-america-standard-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/web/gt-america-standard-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gt-standard",
  display: "swap",
  preload: true,
});

const gtMono = localFont({
  src: "../fonts/web/gt-america-mono-regular.woff2",
  weight: "400",
  variable: "--font-gt-mono",
  display: "swap",
  preload: false,
});

// Telugu faces: their variables are set only on /te (see fontVariables), so English pages never
// download them. The "తె" of the language switch falls back to the phone's own Telugu font there.
const anekTelugu = localFont({
  src: "../fonts/web/anek-telugu-condensed-extrabold.woff2",
  weight: "800",
  variable: "--font-anek-telugu",
  display: "swap",
  preload: false,
});

const notoTelugu = localFont({
  src: "../fonts/web/noto-sans-telugu.woff2",
  weight: "400 600",
  variable: "--font-noto-telugu",
  display: "swap",
  preload: false,
});

/** Class names that define the font variables for a page. Put them on <html>, where the tokens are declared. */
export function fontVariables(lang: "en" | "te") {
  const latin = [rushDriver, gtCompressed, gtExtended, gtStandard, gtMono];
  return (lang === "te" ? [...latin, anekTelugu, notoTelugu] : latin)
    .map((font) => font.variable)
    .join(" ");
}
