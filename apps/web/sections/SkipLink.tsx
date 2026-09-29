import { VisuallyHidden } from "@ngb/ui";

import en from "@/content/en.json";

/** First focusable element on every page. Jumps to `<main id="main">`. */
export function SkipLink() {
  return (
    <VisuallyHidden as="a" href="#main" focusable>
      {en.a11y.skipToContent}
    </VisuallyHidden>
  );
}
