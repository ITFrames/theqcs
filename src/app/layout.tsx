import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import ConsentBanner from "@/components/consent/ConsentBanner";
import ConsentedAnalytics from "@/components/consent/ConsentedAnalytics";
import { NavLoadingProvider } from "@/components/loading/NavLoadingProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QCS ABROAD - Your Gateway to Global Education",
  description:
    "QCS ABROAD is a professional education consultancy helping students achieve their dreams of studying abroad. Expert guidance for university admissions, visa assistance, and career counseling.",
  keywords: [
    "study abroad",
    "education consultancy",
    "international students",
    "university admissions",
    "visa assistance",
    "Canada",
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
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        <ConsentProvider>
          <NavLoadingProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <ConsentBanner />
            <ConsentedAnalytics />
          </NavLoadingProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
