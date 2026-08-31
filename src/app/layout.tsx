import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import ConsentBanner from "@/components/consent/ConsentBanner";
import ConsentedAnalytics from "@/components/consent/ConsentedAnalytics";
import { NavLoadingProvider } from "@/components/loading/NavLoadingProvider";
import LeadCapturePopup from "@/components/LeadCapturePopup";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theqcs.ca"),
  title: {
    default: "QCS ABROAD - Your Gateway to Global Education",
    template: "%s | QCS ABROAD",
  },
  description:
    "QCS ABROAD is a professional education consultancy helping students achieve their dreams of studying abroad. Expert guidance for university admissions, visa assistance, and career counseling.",
  keywords: [
    "study abroad",
    "education consultancy",
    "international students",
    "university admissions",
    "visa assistance",
    "student visa",
    "study in Canada",
    "study in USA",
    "study in UK",
    "study in Australia",
    "career counseling",
    "IELTS",
    "TOEFL",
  ],
  applicationName: "QCS ABROAD",
  authors: [{ name: "QCS ABROAD", url: "https://www.theqcs.ca" }],
  creator: "QCS ABROAD",
  publisher: "QCS ABROAD",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://www.theqcs.ca",
    siteName: "QCS ABROAD",
    title: "QCS ABROAD - Your Gateway to Global Education",
    description:
      "Professional education consultancy helping students study abroad. Expert guidance for university admissions, visa assistance, and career counseling.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QCS ABROAD - Your Gateway to Global Education",
    description:
      "Professional education consultancy helping students study abroad. Expert guidance for admissions, visas, and careers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Organization + Website structured data (JSON-LD).
 * Improves SEO rich results and gives answer engines (AEO) a machine-readable
 * description of the business.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.theqcs.ca/#organization",
      name: "QCS ABROAD",
      url: "https://www.theqcs.ca",
      logo: "https://www.theqcs.ca/QCSLOGO.png",
      description:
        "Professional education consultancy helping students study abroad with expert guidance on university admissions, student visas, and career counseling.",
      areaServed: ["Canada", "United States", "United Kingdom", "Australia"],
      knowsAbout: [
        "Study abroad",
        "University admissions",
        "Student visa assistance",
        "Career counseling",
        "IELTS / TOEFL / PTE preparation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.theqcs.ca/#website",
      url: "https://www.theqcs.ca",
      name: "QCS ABROAD",
      publisher: { "@id": "https://www.theqcs.ca/#organization" },
      inLanguage: "en-CA",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConsentProvider>
          <NavLoadingProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <ConsentBanner />
            <ConsentedAnalytics />
            <LeadCapturePopup />
          </NavLoadingProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
