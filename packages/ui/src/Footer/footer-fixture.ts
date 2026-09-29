/** home.md section 13 and handoff section 6. The legal line is [CONFIRM]. */
export const footerFixture = {
  brandLine: "NGB Evolve. Real growth. Real hustle. No fake flexing.",
  columns: [
    {
      title: "Programs",
      links: [
        { href: "#foundation", label: "Foundation Plan" },
        { href: "#shred-12", label: "Shred 12" },
        { href: "#mass-builder", label: "Mass Builder" },
        { href: "#bodyweight", label: "Master the Bodyweight" },
        { href: "#club", label: "NGB Evolve Club" },
        { href: "#coaching", label: "1:1 Coaching" },
      ],
    },
    {
      title: "Free tools",
      links: [
        { href: "#calories", label: "Calorie calculator" },
        { href: "#plate", label: "Telugu Plate" },
        { href: "#protein", label: "Protein target" },
        { href: "#bmi", label: "BMI" },
      ],
    },
    {
      title: "Help",
      links: [
        { href: "#faq", label: "FAQ" },
        { href: "#contact", label: "Contact" },
        { href: "#refunds", label: "Refund policy" },
        { href: "#privacy", label: "Privacy" },
        { href: "#terms", label: "Terms" },
      ],
    },
  ],
  social: [
    { network: "instagram", href: "#instagram", label: "Instagram" },
    { network: "youtube", href: "#youtube", label: "YouTube" },
    { network: "whatsapp", href: "#whatsapp", label: "WhatsApp" },
  ],
  legalLine: "© 2026 [Registered business name], GSTIN [number], [City, State]",
  healthLine: "Consult a doctor before starting any new exercise or diet plan.",
  lang: { current: "en", enHref: "#en", teHref: "#te" },
  homeHref: "#home",
} as const;
