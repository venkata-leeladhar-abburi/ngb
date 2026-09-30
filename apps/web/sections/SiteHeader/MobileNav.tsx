"use client";

import { MobileHeader, type SiteNavProps } from "@ngb/ui";
import Link from "next/link";
import type { ComponentProps } from "react";

type MobileNavProps = Omit<ComponentProps<typeof MobileHeader>, "linkAs">;

/**
 * MobileHeader with Next.js Link. It lives in its own client file because a Server Component cannot
 * pass a component (a function) to a Client Component as a prop.
 */
export function MobileNav(props: MobileNavProps & Omit<SiteNavProps, "linkAs">) {
  return <MobileHeader {...props} linkAs={Link} />;
}
