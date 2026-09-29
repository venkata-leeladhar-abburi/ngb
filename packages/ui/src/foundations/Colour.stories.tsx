import { contrast, cssVars, forbiddenContrast, tokens } from "@ngb/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  colorClass,
  contrastLevel,
  FoundationPage,
  FoundationSection,
  get,
  ScrollTable,
} from "./parts";

const meta = {
  title: "Foundations/Colour",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const colours = Object.entries(cssVars)
  .filter(([path]) => path.startsWith("color."))
  .map(([path, cssVar]) => ({ path, cssVar, hex: String(get(tokens, path)) }));

const cssVarOf = (path: string): string => cssVars[path as keyof typeof cssVars];
const isSemantic = (pair: { foreground: string; background: string }) =>
  pair.foreground.startsWith("color.") && pair.background.startsWith("color.");

/**
 * Board 02 guidance: share of each colour family on a screen (skill, "Colour").
 * Swatches reuse the role variables as fills; this is documentation only, never product UI.
 */
const usage = [
  { label: "Blacks", share: 60, cssVar: "--background-color-page" },
  { label: "Bone", share: 25, cssVar: "--text-color-primary" },
  { label: "Studio red", share: 10, cssVar: "--background-color-brand" },
  { label: "Signal red, gold and good together", share: 5, cssVar: "--text-color-accent" },
];

function ColourPage() {
  return (
    <FoundationPage
      board="Board 02"
      title="Colour"
      intro="Components use these semantic roles only. Each colour exists only in its role: bg-page works, text-page does not."
    >
      <FoundationSection title="Semantic colours">
        <ul className="grid grid-cols-1 gap-24 md:grid-cols-4">
          {colours.map(({ path, cssVar, hex }) => (
            <li
              key={path}
              className="min-w-0 rounded-card border border-subtle bg-card p-16 wrap-anywhere"
            >
              <div
                aria-hidden="true"
                className="h-96 rounded-card border border-subtle"
                style={{ background: `var(${cssVar})` }}
              />
              <p className="mt-12 font-data text-body">{colorClass(cssVar)}</p>
              <p className="text-muted">{path}</p>
              <p className="font-data text-muted">{hex}</p>
            </li>
          ))}
        </ul>
      </FoundationSection>

      <FoundationSection title="Usage per screen">
        <div
          aria-hidden="true"
          className="flex h-48 overflow-hidden rounded-card border border-subtle"
        >
          {usage.map(({ label, share, cssVar }) => (
            <div key={label} style={{ width: `${share}%`, background: `var(${cssVar})` }} />
          ))}
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-32 gap-y-8 text-muted">
          {usage.map(({ label, share }) => (
            <li key={label}>
              <span className="font-data text-primary">{share}%</span> {label}
            </li>
          ))}
        </ul>
      </FoundationSection>

      <FoundationSection title="Contrast, WCAG 2.2 AA (computed from the tokens)">
        <ScrollTable label="Contrast table">
          <table className="w-full text-left">
            <caption className="sr-only">
              Approved colour pairs with their computed contrast ratio
            </caption>
            <thead className="text-muted">
              <tr>
                <th scope="col" className="pb-12 font-regular">
                  <span className="sr-only">Visual sample</span>
                </th>
                <th scope="col" className="pb-12 font-regular">
                  Pair
                </th>
                <th scope="col" className="pb-12 font-regular">
                  Use
                </th>
                <th scope="col" className="pb-12 font-regular">
                  Ratio
                </th>
                <th scope="col" className="pb-12 font-regular">
                  Board
                </th>
                <th scope="col" className="pb-12 font-regular">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {contrast.filter(isSemantic).map((pair) => {
                const kind = pair.foreground.startsWith("color.border.")
                  ? "ui"
                  : pair.minimum === 3
                    ? "large"
                    : "text";
                return (
                  <tr
                    key={`${pair.foreground}-${pair.background}`}
                    className="border-t border-subtle"
                  >
                    <td className="py-12 pr-16">
                      <div
                        aria-hidden="true"
                        className="flex h-64 w-128 items-center justify-center rounded-card"
                        style={{ background: `var(${cssVarOf(pair.background)})` }}
                      >
                        {kind === "ui" ? (
                          <div
                            className="h-32 w-96 rounded-card border-2"
                            style={{ borderColor: `var(${cssVarOf(pair.foreground)})` }}
                          />
                        ) : (
                          <span
                            className="font-heading text-h1 font-black italic"
                            style={{ color: `var(${cssVarOf(pair.foreground)})` }}
                          >
                            Aa
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-12 pr-16 font-data text-muted">
                      {pair.foregroundHex} on {pair.backgroundHex}
                    </td>
                    <td className="py-12 pr-16">{pair.use}</td>
                    <td className="py-12 pr-16 font-data text-readout">
                      {pair.ratio.toFixed(1)}:1
                    </td>
                    <td className="py-12 pr-16 font-data text-muted">{pair.board}:1</td>
                    <td className="py-12">
                      {pair.ratio >= pair.minimum ? "✓" : "✕"} {contrastLevel(pair.ratio, kind)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollTable>
      </FoundationSection>

      <FoundationSection title="Never, and instead">
        <ul className="grid gap-24 md:grid-cols-2">
          {forbiddenContrast.filter(isSemantic).map((pair) => (
            <li key={pair.use} className="flex items-center gap-16 rounded-card bg-card p-16">
              <span aria-hidden="true" className="flex shrink-0">
                <span
                  className="size-48"
                  style={{ background: `var(${cssVarOf(pair.foreground)})` }}
                />
                <span
                  className="size-48"
                  style={{ background: `var(${cssVarOf(pair.background)})` }}
                />
              </span>
              <span>
                ✕ Never: {pair.use}. <span className="font-data">{pair.ratio.toFixed(1)}:1</span>,
                below the {pair.failsBelow}:1 minimum.
              </span>
            </li>
          ))}
          <li className="rounded-card bg-card p-16">
            ✕ Never: studio red text under 24 px on black.
          </li>
          <li className="flex items-center gap-16 rounded-card bg-card p-16">
            <span
              aria-hidden="true"
              className="size-16 shrink-0 rounded-full bg-(--text-color-good)"
            />
            <span>✕ Never: colour alone for status (a green dot with no word).</span>
          </li>
          <li className="rounded-card bg-card p-16">
            <span className="text-good">✓ Healthy range</span>
            <span className="text-muted">
              {" "}
              ✓ Instead: status colour always with an icon and a word.
            </span>
          </li>
        </ul>
      </FoundationSection>
    </FoundationPage>
  );
}

export const Colour: Story = { render: () => <ColourPage /> };
