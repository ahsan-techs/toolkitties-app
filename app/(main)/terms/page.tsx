import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { termsSections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service | Toolkitties",
  description: "The rules for using Toolkitties: free tools, your responsibilities, acceptable use and limits of liability.",
  alternates: { canonical: "https://toolkitties.com/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lead="The simple rules for using Toolkitties. Please read them before you use the tools."
      sections={termsSections}
    />
  );
}
