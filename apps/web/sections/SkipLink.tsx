import { VisuallyHidden } from "@ngb/ui";

import en from "@/content/en.json";

/**
 * First focusable element on every page. Jumps to `<main id="main">`. Hidden until focused, then shown
 * as a fixed box top-left so it never pushes the page down.
 */
export function SkipLink() {
  return (
    <VisuallyHidden
      as="a"
      href="#main"
      focusable
      className="focus:fixed focus:top-16 focus:left-16 focus:z-(--layer-toast) focus:flex focus:min-h-target focus:items-center focus:bg-page focus:px-16 focus:text-primary"
    >
      {en.a11y.skipToContent}
    </VisuallyHidden>
  );
}
