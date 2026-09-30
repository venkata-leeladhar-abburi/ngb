import { InstagramLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, type ButtonVariant } from "./Button";

const meta = {
  title: "Core/Button",
  component: Button,
  args: { children: "Start my plan", variant: "primary" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "onRed"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Pseudo {
  hover?: boolean;
  active?: boolean;
  focusVisible?: boolean;
}

/** Studio red section, where the onRed variant lives. */
const onRedGround: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div className="bg-brand p-32">
      <Story />
    </div>
  ),
];

const LABEL: Record<ButtonVariant, string> = {
  primary: "Start my plan",
  secondary: "Try free tools",
  onRed: "Start my plan",
};

function state(variant: ButtonVariant, pseudo?: Pseudo, args: Partial<Story["args"]> = {}): Story {
  return {
    args: { variant, children: LABEL[variant], ...args },
    ...(pseudo ? { parameters: { pseudo } } : {}),
    ...(variant === "onRed" ? { decorators: onRedGround } : {}),
  };
}

export const Primary = state("primary");
export const PrimaryHover = state("primary", { hover: true });
export const PrimaryPressed = state("primary", { active: true });
export const PrimaryFocus = state("primary", { focusVisible: true });
export const PrimaryDisabled = state("primary", undefined, { disabled: true });
export const PrimaryLoading = state("primary", undefined, { loading: true });

export const Secondary = state("secondary");
export const SecondaryHover = state("secondary", { hover: true });
export const SecondaryPressed = state("secondary", { active: true });
export const SecondaryFocus = state("secondary", { focusVisible: true });
export const SecondaryDisabled = state("secondary", undefined, { disabled: true });
export const SecondaryLoading = state("secondary", undefined, { loading: true });

export const OnRed = state("onRed");
export const OnRedHover = state("onRed", { hover: true });
export const OnRedPressed = state("onRed", { active: true });
export const OnRedFocus = state("onRed", { focusVisible: true });
export const OnRedDisabled = state("onRed", undefined, { disabled: true });
export const OnRedLoading = state("onRed", undefined, { loading: true });

export const AsLink: Story = {
  args: { as: "a", href: "#programs" },
};

/** Telugu copy for the buy label is not written yet (TODO(copy)). An existing Telugu line tests fit only. */
export const TeluguFitTest: Story = {
  args: { children: "నీ goal ఏంటి?" },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};

const STATES = ["default", "hover", "pressed", "focus", "disabled", "loading"] as const;
const VARIANTS: ButtonVariant[] = ["primary", "secondary", "onRed"];

/** Every variant and state side by side, laid out like board 07 for visual comparison. */
export const AllStates: Story = {
  parameters: {
    layout: "fullscreen",
    pseudo: {
      hover: ['[data-demo="hover"]'],
      active: ['[data-demo="pressed"]'],
      focusVisible: ['[data-demo="focus"]'],
    },
  },
  render: () => (
    <div className="bg-page p-32">
      <table className="border-separate border-spacing-y-16">
        <caption className="sr-only">Button variants and states</caption>
        <thead>
          <tr>
            <td />
            {STATES.map((name) => (
              <th
                key={name}
                scope="col"
                className="px-12 pb-8 font-label text-label text-muted uppercase"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.map((variant) => (
            <tr key={variant} className={variant === "onRed" ? "bg-brand" : undefined}>
              <th scope="row" className="px-16 text-left font-label text-label uppercase">
                {variant === "onRed" ? "On red" : variant}
              </th>
              {STATES.map((name) => (
                <td key={name} className="px-12 py-12">
                  <Button
                    variant={variant}
                    data-demo={name}
                    disabled={name === "disabled"}
                    loading={name === "loading"}
                  >
                    {name === "disabled" ? "Unavailable" : LABEL[variant]}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/** Screen A6: follow buttons with a leading brand icon (the label names the button). */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <Button as="a" href="#instagram" variant="secondary" icon={InstagramLogoIcon}>
        Instagram
      </Button>
      <Button as="a" href="#youtube" variant="secondary" icon={YoutubeLogoIcon}>
        YouTube
      </Button>
    </div>
  ),
};
