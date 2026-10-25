import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { privacySections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy | Toolkitties",
  description:
    "How Toolkitties handles your information. Files stay in your browser, there are no accounts and no tracking cookies.",
  alternates: { canonical: "https://toolkitties.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lead="Plain answers about what happens to your files and your information when you use Toolkitties."
      sections={privacySections}
    />
  );
}
