import { StatStrip, type Stat } from "@ngb/ui";

import { proofStats } from "@/content/catalog";
import { getPageContent } from "@/content/lang";

/** Proof strip (home.md §2, screen A1): real numbers only; they count up once when seen. */
export async function ProofStrip() {
  const { t } = await getPageContent();
  const stats: Stat[] = proofStats.map((stat, index) => ({
    ...stat,
    label: t.home.proof.stats[index] ?? "",
  }));

  return (
    <section aria-label={t.home.proof.label}>
      <StatStrip stats={stats} />
    </section>
  );
}
