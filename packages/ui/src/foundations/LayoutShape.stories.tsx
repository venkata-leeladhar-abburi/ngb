import { cssVars, tokens } from "@ngb/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FoundationPage, FoundationSection, pxText } from "./parts";

const meta = {
  title: "Foundations/Layout and shape",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const spacing = Object.entries(cssVars)
  .filter(([path]) => path.startsWith("primitive.space."))
  .map(([path, cssVar]) => ({ step: path.slice("primitive.space.".length), cssVar }));

const px = (value: string) => value.replace("px", "");

/** Cut corners top-right and bottom-left. Documentation only: components use ChamferBox (Phase 4). */
const chamfer = (size: string) =>
  `polygon(0 0, calc(100% - ${size}) 0, 100% ${size}, 100% 100%, ${size} 100%, 0 calc(100% - ${size}))`;

function LayoutShapePage() {
  const { breakpoint, grid } = tokens.layout;
  return (
    <FoundationPage
      board="Board 05"
      title="Layout, spacing and shape"
      intro="A 4 px base. Only the scale steps exist as classes: p-16 is 16 px, p-5 does not exist."
    >
      <FoundationSection title="Grid (resize the preview: 4 / 8 / 12 columns)">
        {/* 12 cells; the ones beyond this breakpoint's column count are hidden, matching --layout-columns. */}
        <div
          aria-hidden="true"
          className="grid h-96"
          style={{
            gridTemplateColumns: "repeat(var(--layout-columns), 1fr)",
            gap: "var(--layout-gutter)",
          }}
        >
          {Array.from({ length: grid.desktop.columns }, (_, index) => (
            <div
              key={index}
              className={`bg-band ${index >= grid.tablet.columns ? "hidden lg:block" : index >= grid.mobile.columns ? "hidden md:block" : ""}`}
            />
          ))}
        </div>
        <p className="mt-12 text-muted">
          Shown inside the page margin (px-page), which is the grid margin for this breakpoint.
        </p>
        <ul className="mt-16 grid gap-24 font-data text-muted md:grid-cols-3">
          {(["desktop", "tablet", "mobile"] as const).map((size) => (
            <li key={size}>
              <span className="text-primary uppercase">{size}</span>: {grid[size].columns} columns,{" "}
              {px(grid[size].margin)} margins, {px(grid[size].gutter)} gutters
            </li>
          ))}
        </ul>
        <p className="mt-16 font-data">
          Breakpoints: {Object.values(breakpoint).map(px).join(" / ")}. Content max{" "}
          {px(tokens.layout["content-max"])}.
        </p>
      </FoundationSection>

      <FoundationSection title="Spacing">
        <ul className="flex flex-col gap-12">
          {spacing.map(({ step, cssVar }) => (
            <li key={step} className="flex items-center gap-24">
              <span className="w-48 font-data text-muted">{step}</span>
              <span
                className="h-16 bg-(--text-color-primary)"
                style={{ width: `var(${cssVar})` }}
              />
              <span className="font-data text-muted">p-{step}</span>
            </li>
          ))}
        </ul>
        <p className="mt-16">
          Sections: 128 top, 144 bottom on desktop; 64 and 80 on mobile (pt-section-top,
          pb-section-bottom).
        </p>
      </FoundationSection>

      <FoundationSection title="Shape">
        <ul className="grid grid-cols-2 items-end gap-32 md:grid-cols-5">
          <li>
            <div
              aria-hidden="true"
              className="flex h-(--button-height) items-center justify-center bg-action px-24 font-label text-label font-bold uppercase"
              style={{ clipPath: chamfer("var(--shape-chamfer-button)") }}
            >
              Start my plan
            </div>
            <p className="mt-12 text-muted">Button cut {px(tokens.shape.chamfer.button)} px</p>
          </li>
          <li>
            <div
              aria-hidden="true"
              className="inline-flex bg-popular px-12 py-4 font-label text-label font-bold text-on-gold uppercase"
              style={{ clipPath: chamfer("var(--shape-chamfer-tag)") }}
            >
              Pro
            </div>
            <p className="mt-12 text-muted">Tag cut {px(tokens.shape.chamfer.tag)} px</p>
          </li>
          <li>
            <div className="h-64 rounded-card border border-strong bg-card" />
            <p className="mt-12 text-muted">Card radius {px(tokens.shape.radius.card)} px</p>
          </li>
          <li>
            <div
              className="flex h-96 items-center justify-center border border-strong bg-alt text-muted"
              style={{ transform: "skewX(var(--shape-lean))" }}
            >
              <span style={{ transform: "skewX(calc(var(--shape-lean) * -1))" }}>Photo</span>
            </div>
            <p className="mt-12 text-muted">Photo lean {Math.abs(tokens.shape.lean)} degrees</p>
          </li>
          <li>
            <div aria-hidden="true" className="size-(--play-button-size) rounded-full bg-action" />
            <p className="mt-12 text-muted">
              Play button {px(tokens.component["play-button"].size)} px, the only circle
            </p>
          </li>
        </ul>
      </FoundationSection>

      <FoundationSection title="Touch">
        <div className="flex flex-wrap items-end gap-32">
          <div
            aria-hidden="true"
            className="relative h-128 w-64 overflow-hidden rounded-card border border-strong"
          >
            <div className="inset-x-0 bottom-0 absolute h-1/3 bg-band" />
          </div>
          <div className="flex items-center gap-(--spacing-target-gap)">
            <div aria-hidden="true" className="size-target bg-action" />
            <div aria-hidden="true" className="size-target bg-action" />
          </div>
          <p className="max-w-lead">
            Minimum target {pxText(tokens.space.target)}, {pxText(tokens.space["target-gap"])}{" "}
            apart. Primary actions sit in the thumb zone, the bottom third of the phone (shaded).
          </p>
        </div>
      </FoundationSection>
    </FoundationPage>
  );
}

export const LayoutAndShape: Story = { render: () => <LayoutShapePage /> };
