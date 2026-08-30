"use client";

import Link from "next/link";
import {
  GraduationCap,
  FileCheck,
  Languages,
  Award,
  Plane,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceItem {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
  features: string[];
}

const services: ServiceItem[] = [
  {
    icon: GraduationCap,
    step: "01",
    title: "University Selection & Admission",
    description:
      "We help students find the perfect university that aligns with their academic profile, budget, and career goals. Our experienced counselors evaluate your credentials and match you with institutions where you have the highest chances of acceptance.",
    features: [
      "Personalized university shortlisting",
      "SOP writing and editing with expert feedback",
      "LOR guidance and formatting assistance",
      "Application tracking and deadline management",
    ],
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Visa Assistance & Documentation",
    description:
      "Navigating visa applications can be overwhelming, but our team ensures a smooth and stress-free experience. We provide a comprehensive documentation checklist tailored to your destination country and conduct mock interviews.",
    features: [
      "Complete visa application form review",
      "Country-specific documentation checklist",
      "Mock visa interview preparation",
      "Financial documentation guidance",
    ],
  },
  {
    icon: Languages,
    step: "03",
    title: "IELTS / TOEFL Preparation",
    description:
      "Achieve the scores you need with our focused English proficiency test preparation programs. Our certified trainers provide structured coaching, proven strategies, and regular practice tests to track your improvement.",
    features: [
      "Expert coaching with certified trainers",
      "Comprehensive study materials",
      "Weekly practice tests with analysis",
      "Personalized score improvement plans",
    ],
  },
  {
    icon: Award,
    step: "04",
    title: "Scholarship Guidance",
    description:
      "Studying abroad doesn't have to break the bank. We research and identify scholarships, fellowships, and financial aid opportunities that match your profile and field of study.",
    features: [
      "Scholarship research and matching",
      "Application essay writing and review",
      "Financial aid and assistantship help",
      "Merit-based and need-based options",
    ],
  },
  {
    icon: Plane,
    step: "05",
    title: "Pre-Departure Briefing",
    description:
      "Leaving home for a new country is exciting but can also feel daunting. Our pre-departure sessions cover everything you need to know before your journey, from cultural nuances to practical travel tips.",
    features: [
      "Cultural orientation and expectations",
      "Travel planning and packing guide",
      "Accommodation booking assistance",
      "Airport and immigration guidelines",
    ],
  },
  {
    icon: Users,
    step: "06",
    title: "Post-Arrival Support",
    description:
      "Our support doesn't end when you board the plane. Once you arrive at your destination, we help you settle in smoothly with local orientation and essential setup tasks.",
    features: [
      "Local orientation and city navigation",
      "Bank account and SIM card setup",
      "Accommodation and lease guidance",
      "Student community networking",
    ],
  },
];

export default function ServicesContent() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2440] via-[#1e3a5f] to-[#152a45] text-white">
        {/* decorative shapes */}
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-narrow relative z-10 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] backdrop-blur-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            End-to-End Student Support
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Comprehensive support for students at every stage of their study
            abroad journey — from choosing the right university to settling into
            your new home.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn btn-accent px-7 py-3">
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#services-list"
              className="btn btn-outline-light px-7 py-3"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* ===== Services grid ===== */}
      <section id="services-list" className="section-padding bg-background-alt">
        <div className="container-narrow">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="group border-border-light relative flex flex-col overflow-hidden rounded-2xl border bg-white p-7 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]"
                >
                  {/* big faint step number */}
                  <span
                    className="text-primary/[0.05] pointer-events-none absolute -top-4 -right-2 text-7xl font-black select-none"
                    aria-hidden="true"
                  >
                    {service.step}
                  </span>

                  {/* accent top bar on hover */}
                  <span
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden="true"
                  />

                  {/* icon */}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  <span className="mb-1 block text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">
                    Step {service.step}
                  </span>
                  <h2 className="text-primary text-xl font-bold">
                    {service.title}
                  </h2>
                  <p className="text-foreground-muted mt-3 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* features */}
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-foreground-muted flex items-start gap-2 text-sm"
                      >
                        <CheckCircle
                          className="text-accent mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* footer link */}
                  <div className="border-border-light mt-auto border-t pt-5">
                    <Link
                      href="/contact"
                      className="text-primary group-hover:text-accent-dark inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    >
                      Get Started
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Bottom CTA ===== */}
      <section className="section-padding bg-primary text-white">
        <div className="container-narrow text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Begin Your Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Take the first step towards your international education dream. Our
            expert counselors are here to guide you every step of the way.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn btn-accent px-7 py-3">
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="btn btn-outline-light px-7 py-3">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
