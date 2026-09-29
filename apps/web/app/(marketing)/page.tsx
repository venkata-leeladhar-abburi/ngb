import en from "@/content/en.json";
import { Placeholder } from "@/sections/Placeholder";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

export default function HomePage() {
  return <Placeholder headline={en.home.headline} sub={en.home.sub} />;
}
