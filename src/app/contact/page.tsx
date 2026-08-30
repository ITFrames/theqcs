"use client";

import { useCallback, useState } from "react";
import {
  MapPin,
  Mail,
  Clock,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import Turnstile from "@/components/Turnstile";
import { trackEvent } from "@/lib/analytics";

const serviceOptions = [
  "University Admissions Counseling",
  "Visa & Immigration Assistance",
  "Scholarship Guidance",
  "Career Counseling",
  "Test Preparation (IELTS/TOEFL)",
  "Pre-Departure Support",
  "Other",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@theqcs.ca",
  },
  {
    icon: MapPin,
    label: "Our Offices",
    value: "Toronto, ON, Canada\nHyderabad, Telangana, India",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Fri: 9:00 AM – 6:00 PM\nSat: 10:00 AM – 3:00 PM\nSun: Closed",
  },
];

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/qcsabroad",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/qcsabroad",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/qcsabroad",
    label: "LinkedIn",
  },
  { icon: Twitter, href: "https://x.com/qcsabroad", label: "X (Twitter)" },
  {
    icon: MessageCircle,
    href: "https://wa.me/16478903806?text=Hi+QCS+ABROAD%21+%F0%9F%91%8B%0A%0AI%27m+interested+in+studying+abroad+and+would+like+guidance+with+my+application.%0A%0A%F0%9F%8C%8D+Preferred+Country%3A%0A%F0%9F%8E%93+Program+%2F+Course%3A%0A%F0%9F%93%9A+Current+Qualification%3A%0A%F0%9F%93%85+Preferred+Intake%3A%0A%0APlease+help+me+understand+my+study+options+and+the+next+steps.%0A%0AThank+you%21",
    label: "WhatsApp",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  // Anti-bot: record when the form was rendered so we can reject submissions
  // that happen implausibly fast (a common bot signature).
  const [formLoadedAt] = useState<number>(() => Date.now());

  const onVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const onExpire = useCallback(() => setTurnstileToken(""), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;

    // 1) Honeypot check — a hidden field that only bots tend to fill in.
    const honeypot = (
      form.elements.namedItem("company_website") as HTMLInputElement | null
    )?.value;
    if (honeypot) {
      // Silently pretend success so bots don't learn they were blocked.
      setSubmitted(true);
      return;
    }

    // 2) Time-trap — humans take at least a few seconds to fill the form.
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 3000) {
      setSubmitted(true);
      return;
    }

    // Require a Turnstile token when the widget is active (site key present).
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (siteKey && !turnstileToken) {
      setError("Please complete the bot verification before sending.");
      return;
    }

    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          phone: data.get("phone"),
          service: data.get("service"),
          message: data.get("message"),
          company_website: data.get("company_website"),
          turnstileToken,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      // Conversion: contact enquiry submitted (consent-gated inside trackEvent).
      trackEvent(
        "generate_lead",
        { form: "contact" },
        { metaStandardEvent: "Lead" },
      );
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="relative bg-[var(--color-primary)] py-20 text-white lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary-light)] opacity-80" />
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Get In <span className="text-[var(--color-accent)]">Touch</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Have questions about studying abroad? We&apos;re here to help. Reach
            out to our team and let&apos;s start planning your future together.
          </p>
        </div>
      </section>

      {/* Contact Form + Sidebar */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                Send Us a Message
              </h2>
              <p className="mt-2 text-[var(--color-foreground-muted)]">
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="mt-4 text-xl font-semibold text-green-800">
                    Message Sent Successfully!
                  </h3>
                  <p className="mt-2 text-green-700">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                  noValidate={false}
                >
                  {/*
                    Honeypot field — hidden from real users but often auto-filled
                    by bots. Kept off-screen and out of the tab order; if it
                    contains a value, the submission is treated as spam.
                  */}
                  <div
                    aria-hidden="true"
                    className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
                  >
                    <label htmlFor="company_website">
                      Company Website (leave this field empty)
                    </label>
                    <input
                      type="text"
                      id="company_website"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[var(--color-foreground)]"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="John Doe"
                        className="mt-2 block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] transition-all duration-200 placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[var(--color-foreground)]"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        className="mt-2 block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] transition-all duration-200 placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-[var(--color-foreground)]"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+1 (416) 555-0000"
                        pattern="[+]?[\d\s\-()]{7,20}"
                        className="mt-2 block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] transition-all duration-200 placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      />
                    </div>

                    {/* Service Interest */}
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-medium text-[var(--color-foreground)]"
                      >
                        Service Interest <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        defaultValue=""
                        className="mt-2 block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] transition-all duration-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[var(--color-foreground)]"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={5}
                      placeholder="Tell us about your goals, questions, or how we can help..."
                      className="mt-2 block w-full resize-y rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] transition-all duration-200 placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>

                  {/* Bot verification (Cloudflare Turnstile) */}
                  <Turnstile onVerify={onVerify} onExpire={onExpire} />

                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary px-8 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-background-alt)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  Contact Information
                </h3>
                <div className="mt-6 space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                        <item.icon className="h-5 w-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-sm whitespace-pre-line text-[var(--color-foreground-muted)]">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-background-alt)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  Follow Us
                </h3>
                <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
                  Stay connected for the latest updates and tips.
                </p>
                <div className="mt-4 flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-colors duration-200 hover:bg-[var(--color-primary-light)]"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
