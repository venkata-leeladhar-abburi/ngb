import { tokens } from "@ngb/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FoundationPage, FoundationSection, pxText } from "./parts";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Role = keyof typeof tokens.type;

/** Board 04: face, classes, the board's sample text (sentence case; CSS uppercases) and the face's job. */
const roles: { role: Role; face: string; className: string; sample: string; job: string }[] = [
  {
    role: "mega",
    face: "Rush Driver Italic",
    className: "font-display text-mega uppercase italic",
    sample: "Evolve",
    job: "Poster words, stats, prices. Capitals only. Five words max.",
  },
  {
    role: "hero",
    face: "Rush Driver Italic",
    className: "font-display text-hero uppercase italic",
    sample: "Day one",
    job: "Poster words, stats, prices. Capitals only. Five words max.",
  },
  {
    role: "display",
    face: "Rush Driver Italic",
    className: "font-display text-display uppercase italic",
    sample: "Start today",
    job: "Poster words, stats, prices. Capitals only. Five words max.",
  },
  {
    role: "h1",
    face: "GT America Compressed Black Italic",
    className: "font-heading text-h1 font-black uppercase italic text-accent",
    sample: "Free tools",
    job: "Section titles, uppercase.",
  },
  {
    role: "h2",
    face: "GT America Extended Bold",
    className: "font-label text-h2 font-bold uppercase",
    sample: "Shred 12",
    job: "Buttons, tags, program names.",
  },
  {
    role: "h3",
    face: "GT America Standard Bold",
    className: "font-body text-h3 font-bold",
    sample: "Calorie calculator",
    job: "Everything people read.",
  },
  {
    role: "lead",
    face: "GT America Standard",
    className: "font-body text-lead",
    sample: "Train the way I trained.",
    job: "Everything people read.",
  },
  {
    role: "body",
    face: "GT America Standard",
    className: "font-body text-body",
    sample: "Real food. Real plan.",
    job: "Everything people read.",
  },
  {
    role: "label",
    face: "GT America Extended",
    className: "font-label text-label font-bold uppercase",
    sample: "Start my plan",
    job: "Buttons, tags, program names.",
  },
  {
    role: "readout",
    face: "GT America Mono",
    className: "font-data text-readout",
    sample: "2,480 kcal · 115 g",
    job: "Numbers that line up.",
  },
];

const size = (value: string) => Number.parseFloat(value);

function TypographyPage() {
  const { measure } = tokens;
  return (
    <FoundationPage
      board="Board 04"
      title="Typography"
      intro={`Typefaces by role, never swapped. Sizes are fluid between a ${pxText(tokens.layout.breakpoint.sm)} phone and a ${pxText(tokens.layout.breakpoint["2xl"])} desktop.`}
    >
      <FoundationSection title="Type scale (desktop / mobile, px)">
        <ul>
          {roles.map(({ role, face, className, sample, job }) => (
            <li
              key={role}
              className="border-t border-subtle py-16 md:grid md:grid-cols-4 md:items-center md:gap-24"
            >
              <div className="mb-12 md:mb-0">
                <p className="font-data uppercase">
                  {role}{" "}
                  <span className="text-muted">
                    {size(tokens.type[role].desktop)} / {size(tokens.type[role].mobile)}
                  </span>
                </p>
                <p className="text-muted">{face}</p>
                <p className="text-muted">{job}</p>
              </div>
              {/* Mega is wider than a 360 px screen by design: in the hero it bleeds off the edges, so crop it here too. */}
              <p
                className={`min-w-0 md:col-span-3 ${role === "mega" ? "overflow-hidden whitespace-nowrap" : "wrap-anywhere"} ${className}`}
              >
                {sample}
              </p>
            </li>
          ))}
        </ul>
      </FoundationSection>

      <FoundationSection title="Telugu (loaded only on /te pages)">
        <div lang="te" className="flex flex-col gap-24">
          <div>
            <p className="font-data text-muted" lang="en">
              Anek Telugu ExtraBold, skewed to match the italic headings
            </p>
            <p
              className="font-telugu-heading text-h1 font-extrabold"
              style={{ transform: "skewX(var(--shape-lean))" }}
            >
              నీ <span lang="en">Day One</span> ఈరోజే.
            </p>
          </div>
          <div>
            <p className="font-data text-muted" lang="en">
              Noto Sans Telugu, line height {tokens["line-height"].telugu}
            </p>
            <p className="font-telugu-body text-lead">నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు.</p>
          </div>
        </div>
      </FoundationSection>

      <FoundationSection title="Rules">
        <ul className="grid gap-24 md:grid-cols-3">
          <li>Body never below {pxText(tokens.type.body.mobile)}.</li>
          <li>
            {measure["body-min"]} to {measure["body-max"]} characters per line.
          </li>
          <li>
            Line height {tokens["line-height"].body} English, {tokens["line-height"].telugu} Telugu.
          </li>
          <li>
            Display line height {tokens["line-height"].display}, headings{" "}
            {tokens["line-height"].heading}; labels tracked {tokens["letter-spacing"].label}.
          </li>
          <li>No italics in body text.</li>
          <li>Max 2 typefaces per component.</li>
        </ul>
      </FoundationSection>
    </FoundationPage>
  );
}

export const Typography: Story = { render: () => <TypographyPage /> };
