import { contrast, forbiddenContrast, tokens } from "@ngb/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FoundationPage, FoundationSection, pxText } from "./parts";

const meta = {
  title: "Foundations/Ember and depth",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const stops = tokens.gradient.ember;
const strip = `linear-gradient(to right, ${stops.map(({ color, position }) => `${color} ${position * 100}%`).join(", ")})`;
const onDarkZone = contrast.find(({ background }) => background === "primitive.ember.stop-74");
const onBrightMiddle = forbiddenContrast.find(
  ({ background }) => background === "primitive.ember.stop-52",
);

const [focusGap, focusRing] = tokens.shadow.focus.map(({ spread }) => Number.parseFloat(spread));

const shadows = [
  { name: "shadow-rest", use: "Cards at rest", lifted: false },
  {
    name: "shadow-hover",
    use: `Hovered cards, menus, sticky buy bar, lifted ${pxText(tokens.motion.lift.card)} (shown lifted)`,
    lifted: true,
  },
  {
    name: "shadow-sells",
    use: "The one thing that sells on this screen. One per screen.",
    lifted: false,
  },
  {
    name: "shadow-focus",
    use: `Keyboard focus: ${focusGap ?? 0} px gap, ${(focusRing ?? 0) - (focusGap ?? 0)} px signal red ring`,
    lifted: false,
  },
] as const;

function EmberDepthPage() {
  return (
    <FoundationPage
      board="Board 03"
      title="Ember and depth"
      intro="The ember gradient is only for transformation cards, the featured program, share cards and the final-call glow. Text sits only on its dark lower zone."
    >
      <FoundationSection title="Ember gradient">
        <div className="grid gap-32 md:grid-cols-2">
          <div
            className="relative flex aspect-3/4 flex-col justify-end overflow-hidden rounded-card p-24"
            style={{ background: "var(--gradient-ember)" }}
          >
            <p className="font-label text-h2 font-bold uppercase">Dark zone only</p>
            <p>Text goes here, on the dark lower zone.</p>
          </div>
          <ul className="flex flex-col gap-16">
            <li>Radial, core at 36% across and 24% down.</li>
            <li>✓ Transformation cards, featured program, story share cards, final-call glow.</li>
            <li>✕ Text backgrounds, buttons, icons, tool results.</li>
            <li>✕ Text over the bright middle.</li>
          </ul>
        </div>

        <div aria-hidden="true" className="mt-32 h-32 rounded-card" style={{ background: strip }} />
        <ul className="mt-12 grid grid-cols-3 gap-16 font-data text-muted md:grid-cols-6">
          {stops.map(({ color, position }) => (
            <li key={color}>
              <span className="block text-primary">{color}</span>
              {Math.round(position * 100)}%
            </li>
          ))}
        </ul>
      </FoundationSection>

      <FoundationSection title="Text on ember (computed)">
        <div className="grid gap-32 md:grid-cols-2">
          {onDarkZone && (
            <figure>
              <div className="rounded-card p-24" style={{ background: onDarkZone.backgroundHex }}>
                <p className="font-label text-h2 font-bold uppercase">Name, Town</p>
                <p className="font-data">12 weeks / +X kg</p>
              </div>
              <figcaption className="mt-12">
                ✓ <span className="font-data">{onDarkZone.ratio.toFixed(1)}:1</span> on the dark
                zone ({onDarkZone.backgroundHex}). Passes for all text.
              </figcaption>
            </figure>
          )}
          {onBrightMiddle && (
            <figure>
              <div
                className="rounded-card p-24"
                style={{ background: onBrightMiddle.backgroundHex }}
              >
                <p className="font-label text-h2 font-bold uppercase">Name, Town</p>
              </div>
              <figcaption className="mt-12">
                ✕ <span className="font-data">{onBrightMiddle.ratio.toFixed(1)}:1</span> on the
                bright middle ({onBrightMiddle.backgroundHex}). Fails for body text (needs{" "}
                {onBrightMiddle.failsBelow}:1); never place text here.
              </figcaption>
            </figure>
          )}
        </div>
        <p className="mt-16 text-muted">
          Placeholders: real names and results come only from consented clients in the CMS.
        </p>
      </FoundationSection>

      <FoundationSection title="Ghost word (the only gradient text)">
        <div className="overflow-hidden rounded-card bg-brand px-32">
          <p
            aria-hidden="true"
            className="bg-clip-text font-display text-mega text-transparent uppercase italic opacity-70"
            style={{ backgroundImage: "var(--gradient-ghost)" }}
          >
            Evolve
          </p>
        </div>
        <p className="mt-12 text-muted">
          Behind Nawin on the red studio. Decorative, 70% opacity, hidden from screen readers.
        </p>
      </FoundationSection>

      <FoundationSection title="Elevation">
        <ul className="grid gap-32 md:grid-cols-4">
          {shadows.map(({ name, use, lifted }) => (
            <li
              key={name}
              className={`rounded-card border border-subtle bg-card p-24 ${name}`}
              style={
                lifted ? { transform: "translateY(calc(var(--motion-lift-card) * -1))" } : undefined
              }
            >
              <p className="font-data">{name}</p>
              <p className="mt-8 text-muted">{use}</p>
            </li>
          ))}
        </ul>
      </FoundationSection>
    </FoundationPage>
  );
}

export const EmberAndDepth: Story = { render: () => <EmberDepthPage /> };
