import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { accessibilitySections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Accessibility Statement | Toolkitties",
  description: "What Toolkitties does today to be usable by keyboard, screen reader and assistive-technology users — and where that work is still in progress.",
  alternates: { canonical: "https://toolkitties.com/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalLayout
      title="Accessibility Statement"
      lead="An honest account of what's built for accessibility today, and where we still have work to do."
      sections={accessibilitySections}
      path="/accessibility"
    />
  );
}
