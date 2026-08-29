import type { Metadata } from "next";
import ServicesContent from "@/components/ServicesContent";

export const metadata: Metadata = {
  title: "Our Services - QCS ABROAD",
  description:
    "Comprehensive study abroad services including university selection, visa assistance, IELTS/TOEFL preparation, scholarship guidance, pre-departure briefing, and post-arrival support.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
