import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import CookiePreferencesButton from "@/components/consent/CookiePreferencesButton";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Study Guides" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Student Login" },
];

const services = [
  { href: "/services", label: "University Admissions" },
  { href: "/services", label: "Visa Assistance" },
  { href: "/services", label: "IELTS/TOEFL Preparation" },
  { href: "/services", label: "Scholarship Guidance" },
  { href: "/services", label: "Pre-Departure Briefing" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/qcsabroad",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://www.instagram.com/qcsabroad",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.linkedin.com/company/qcsabroad",
    label: "LinkedIn",
    icon: Linkedin,
  },
  { href: "https://x.com/qcsabroad", label: "X (Twitter)", icon: Twitter },
  {
    href: "https://wa.me/16478903806?text=Hi+QCS+ABROAD%21+%F0%9F%91%8B%0A%0AI%27m+interested+in+studying+abroad+and+would+like+guidance+with+my+application.%0A%0A%F0%9F%8C%8D+Preferred+Country%3A%0A%F0%9F%8E%93+Program+%2F+Course%3A%0A%F0%9F%93%9A+Current+Qualification%3A%0A%F0%9F%93%85+Preferred+Intake%3A%0A%0APlease+help+me+understand+my+study+options+and+the+next+steps.%0A%0AThank+you%21",
    label: "WhatsApp",
    icon: MessageCircle,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/QCS-O.webp"
                alt="QCS ABROAD logo"
                width={40}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
              <span className="text-2xl font-bold tracking-tight text-white">
                QCS{" "}
                <span className="font-light text-[var(--color-accent)]">
                  ABROAD
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Your trusted partner in global education. We guide students
              through every step of their international academic journey.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)]"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase">
              Our Services
            </h3>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-[var(--color-accent)] uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:contact@theqcs.ca"
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  contact@theqcs.ca
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  Toronto, Canada &middot; Hyderabad, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/50">
            &copy; 2026 QCS ABROAD, a brand of 13115984 Canada Inc. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-white/50 transition-colors duration-200 hover:text-white/80"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/50 transition-colors duration-200 hover:text-white/80"
            >
              Terms of Service
            </Link>
            <CookiePreferencesButton className="cursor-pointer text-xs text-white/50 transition-colors duration-200 hover:text-white/80" />
          </div>
        </div>

        {/* Incubation credit */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/40">
            Powered by{" "}
            <a
              href="https://itframes.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/60 transition-colors duration-200 hover:text-[var(--color-accent)]"
            >
              itframes.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
