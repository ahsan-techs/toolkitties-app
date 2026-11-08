import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { refundSections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Refund Policy | Toolkitties",
  description: "How cancelling and refunds work for the optional Toolkitties Support plans — processed by Lemon Squeezy.",
  alternates: { canonical: "https://toolkitties.com/refund" },
};

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      lead="For the optional Support plans — not for the tools themselves, which are free for everyone regardless."
      sections={refundSections}
      path="/refund"
    />
  );
}
