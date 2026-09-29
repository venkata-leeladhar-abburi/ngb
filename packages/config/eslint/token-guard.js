// Blocks raw design values outside packages/tokens (playbook section 8, CLAUDE.md design system rules).
// Colours, sizes, shadows and z-index must come from tokens (CSS variables / Tailwind theme).

const HEX = "#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\\b";
const COLOR_FN = "\\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\\(";
const PX = "\\b\\d+(?:\\.\\d+)?px\\b";
const TW_ARBITRARY = "-\\[(?:#|\\d|rgb|hsl|oklch)";

const message = (what) =>
  `${what} is not allowed here. Use a token from packages/tokens (see the ngb-design-system skill).`;

const literalRules = [
  [HEX, "A raw hex colour"],
  [COLOR_FN, "A raw colour function"],
  [PX, "A raw px value"],
  [TW_ARBITRARY, "A Tailwind arbitrary value"],
].flatMap(([pattern, what]) => [
  { selector: `Literal[value=/${pattern}/]`, message: message(what) },
  { selector: `TemplateElement[value.raw=/${pattern}/]`, message: message(what) },
]);

const styleRules = ["zIndex", "boxShadow", "color", "backgroundColor", "fontSize"].map((prop) => ({
  selector: `Property[key.name='${prop}'] > Literal`,
  message: message(`A literal ${prop}`),
}));

export const tokenGuard = {
  name: "ngb/token-guard",
  rules: {
    "no-restricted-syntax": ["error", ...literalRules, ...styleRules],
  },
};
