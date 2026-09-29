import Link from "next/link";

import en from "@/content/en.json";
import { Placeholder } from "@/sections/Placeholder";

// Phase 6 replaces this with the NotFound section (screen C3) and adds the "Try free tools" button once /tools exists.
export default function NotFound() {
  return (
    <Placeholder headline={en.notFound.headline} sub={en.notFound.sub}>
      <Link href="/">{en.notFound.home}</Link>
    </Placeholder>
  );
}
