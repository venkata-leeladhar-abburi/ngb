import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompareTable } from "./CompareTable";

const cta = (slug: string) => ({ href: `/programs/${slug}`, label: "Start my plan" });

function renderTable() {
  render(
    <CompareTable
      caption="Compare the plans"
      columns={[
        { name: "Foundation Plan", cta: cta("foundation-plan") },
        { name: "Shred 12", featured: true, cta: cta("shred-12") },
      ]}
      rows={[
        { label: "Weeks", cells: [8, 12] },
        { label: "Hostel version", cells: [true, false] },
      ]}
    />,
  );
}

describe("CompareTable", () => {
  it("is a named table inside a focusable scroll region", () => {
    renderTable();

    expect(screen.getByRole("table", { name: "Compare the plans" })).toBeInTheDocument();
    const region = screen.getByRole("region", { name: "Compare the plans" });
    expect(region).toHaveAttribute("tabindex", "0");
  });

  it("gives every value a program header and a fact header", () => {
    renderTable();

    expect(screen.getAllByRole("columnheader").map((th) => th.textContent)).toEqual([
      "Foundation Plan",
      "Shred 12",
    ]);
    const weeks = screen.getByRole("row", { name: /^Weeks/ });
    expect(within(weeks).getByRole("rowheader")).toHaveTextContent("Weeks");
    expect(
      within(weeks)
        .getAllByRole("cell")
        .map((td) => td.textContent),
    ).toEqual(["8", "12"]);
  });

  it("says yes and no in words, not by icon alone", () => {
    renderTable();

    const hostel = screen.getByRole("row", { name: /^Hostel version/ });
    expect(within(hostel).getByRole("img", { name: "Yes" })).toBeInTheDocument();
    expect(within(hostel).getByRole("img", { name: "No" })).toBeInTheDocument();
  });

  it("names each buy link with its program", () => {
    renderTable();

    const link = screen.getByRole("link", { name: "Start my plan: Shred 12" });
    expect(link).toHaveAttribute("href", "/programs/shred-12");
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
