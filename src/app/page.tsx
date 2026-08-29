import {
  GraduationCap,
  FileCheck,
  Languages,
  Award,
  Plane,
  HeartHandshake,
  Users,
  Building2,
  Globe,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  MapPin,
  Briefcase,
  Wallet,
  Compass,
  BookOpen,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import FlightRoutes from "@/components/FlightRoutes";
import DestinationsGrid from "@/components/DestinationsGrid";
import StudyMatcher from "@/components/StudyMatcher";
import HeroImage from "@/components/HeroImage";
import HeroBackground from "@/components/HeroBackground";

const stats = [
  { icon: Users, value: "500+", label: "Students Placed" },
  { icon: Building2, value: "50+", label: "University Partners" },
  { icon: Globe, value: "15+", label: "Countries" },
  { icon: ShieldCheck, value: "98%", label: "Visa Success Rate" },
];

const services = [
  {
    icon: GraduationCap,
    title: "University Selection & Admission",
    description:
      "We match you with the best universities based on your academic profile, career goals, and budget—then guide you through every step of the application process.",
    href: "/services#admission",
  },
  {
    icon: FileCheck,
    title: "Visa Assistance & Documentation",
    description:
      "Navigate complex visa requirements with confidence. Our experts ensure your documentation is complete, accurate, and submitted on time.",
    href: "/services#visa",
  },
  {
    icon: Languages,
    title: "IELTS/TOEFL Preparation",
    description:
      "Achieve the scores you need with structured preparation programs, practice tests, and one-on-one coaching from certified instructors.",
    href: "/services#test-prep",
  },
  {
    icon: Award,
    title: "Scholarship Guidance",
    description:
      "Unlock funding opportunities you never knew existed. We identify scholarships you qualify for and help craft compelling applications.",
    href: "/services#scholarships",
  },
  {
    icon: Plane,
    title: "Pre-Departure Briefing",
    description:
      "Feel prepared and confident before you travel. From accommodation to cultural tips, we cover everything you need to know.",
    href: "/services#pre-departure",
  },
  {
    icon: HeartHandshake,
    title: "Post-Arrival Support",
    description:
      "Our support doesn't stop at the airport. We help you settle in, connect with communities, and resolve any challenges abroad.",
    href: "/services#post-arrival",
  },
];

const decisionFactors = [
  { icon: MapPin, text: "Your decision on Immigration priority" },
  { icon: GraduationCap, text: "Your decision on Higher studies" },
  { icon: Briefcase, text: "Your decision on Employment preferences" },
  { icon: Wallet, text: "Your decision based on your current Financial Stability" },
  { icon: Compass, text: "Your decision based on your Future goals" },
];

const whyStudyAbroad = [
  {
    icon: BookOpen,
    title: "Flexible Courses",
    description:
      "Choose from a wide range of programs and customize your learning path to match your career ambitions.",
  },
  {
    icon: Award,
    title: "High Quality Education",
    description:
      "Access world-class institutions known for academic excellence and globally recognized qualifications.",
  },
  {
    icon: Sparkles,
    title: "Progressive Experiences",
    description:
      "Gain exposure to modern teaching methods, research opportunities, and real-world industry connections.",
  },
  {
    icon: Users,
    title: "Personality Development",
    description:
      "Build confidence, independence, and a global mindset by immersing yourself in a new culture.",
  },
  {
    icon: MessageCircle,
    title: "Learn a Foreign Language",
    description:
      "Develop valuable language skills that open doors to global careers and richer cultural understanding.",
  },
];

const differentiators = [
  {
    icon: Target,
    title: "Personalized Approach",
    description:
      "No two students are alike. We create customized roadmaps tailored to your unique academic background, aspirations, and circumstances.",
  },
  {
    icon: CheckCircle2,
    title: "Proven Track Record",
    description:
      "With a 98% visa success rate and 500+ successful placements, our results speak for themselves. Your success is our reputation.",
  },
  {
    icon: Clock,
    title: "End-to-End Support",
    description:
      "From initial consultation to post-arrival assistance, we walk with you at every stage. One team, one relationship, complete peace of mind.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Our partnerships with 50+ universities across 15+ countries give you access to opportunities that others simply cannot offer.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    university: "University of Toronto",
    country: "Canada",
    rating: 5,
    quote:
      "QCS ABROAD made my dream of studying in Canada a reality. Their counselors were incredibly knowledgeable about the Canadian admission process and helped me secure a scholarship I didn't even know I qualified for. I can't thank them enough.",
  },
  {
    name: "Ahmed Hassan",
    university: "University of Melbourne",
    country: "Australia",
    rating: 5,
    quote:
      "I was overwhelmed by the visa process, but the team at QCS handled everything with such professionalism. From document preparation to interview coaching, they were there every step of the way. Truly a world-class service.",
  },
  {
    name: "Maria Santos",
    university: "University College London",
    country: "United Kingdom",
    rating: 5,
    quote:
      "The personalized attention I received was remarkable. My counselor understood my career goals and matched me with the perfect program. The pre-departure briefing also helped me feel confident about moving to London.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-white via-[#f0f4f8] to-[#e8eef5]"
        aria-labelledby="hero-heading"
      >
        {/* Decorative shapes */}
        <div
          className="hero-aurora absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#1e3a5f]/[0.04] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="hero-aurora absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#d4a853]/[0.06] blur-3xl"
          style={{ animationDelay: "6s" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-[#1e3a5f]/[0.04]"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full border border-[#d4a853]/[0.06]"
          aria-hidden="true"
        />

        {/* Animated landmark background (floating icons + sliding marquee) */}
        <HeroBackground />

        <div className="container-narrow relative z-10 py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <p className="hero-rise hero-delay-1 mb-4 inline-block overflow-hidden rounded-full border border-accent/20 bg-white/50 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-accent backdrop-blur-sm badge-shimmer">
                Trusted Education Consultancy
              </p>
              <h1
                id="hero-heading"
                className="hero-rise hero-delay-2 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl"
              >
                Your Gateway to{" "}
                <span className="text-gradient-animated">Global Education</span>
              </h1>
              <p className="hero-rise hero-delay-3 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted md:text-xl lg:mx-0">
                QCS ABROAD helps students navigate their journey to world-class
                universities. Expert guidance, personalized support, proven
                results.
              </p>
              <div className="hero-rise hero-delay-4 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <a
                  href="/services"
                  className="btn btn-primary group px-8 py-3 text-base"
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4 cta-nudge" aria-hidden="true" />
                </a>
                <a
                  href="/contact"
                  className="btn btn-outline px-8 py-3 text-base"
                >
                  Book Consultation
                </a>
              </div>
            </div>

            {/* Right: animated student photo */}
            <div className="hero-rise hero-delay-3 hidden lg:block">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="relative -mt-8 z-20 section-padding pt-0 pb-16"
        aria-label="Key statistics"
      >
        <div className="container-narrow">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 text-center shadow-[var(--shadow-lg)] border border-border-light"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3a5f]/[0.08]">
                  <stat.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-2xl font-bold text-primary md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Global Flight Network */}
      <FlightRoutes />

      {/* Interactive Study Abroad Matcher */}
      <StudyMatcher />

      {/* Services Preview */}
      <section
        className="section-padding bg-background-alt"
        aria-labelledby="services-heading"
      >
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              What We Offer
            </p>
            <h2
              id="services-heading"
              className="text-3xl font-bold text-primary md:text-4xl"
            >
              Comprehensive Student Services
            </h2>
            <p className="mt-4 text-foreground-muted">
              From your first consultation to settling into your new city, we
              provide end-to-end support for every stage of your study abroad
              journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group flex flex-col rounded-xl border border-border-light bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-250 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#d4a853]/[0.12]">
                  <service.icon
                    className="h-6 w-6 text-accent-dark"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-primary">
                  {service.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-foreground-muted">
                  {service.description}
                </p>
                <a
                  href={service.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent-dark transition-colors"
                >
                  Learn More
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="section-padding bg-white"
        aria-labelledby="why-choose-heading"
      >
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Why QCS ABROAD
            </p>
            <h2
              id="why-choose-heading"
              className="text-3xl font-bold text-primary md:text-4xl"
            >
              Why Students Choose Us
            </h2>
            <p className="mt-4 text-foreground-muted">
              We combine deep expertise with genuine care to deliver an
              experience that sets the standard in education consulting.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Which Country Do You Prefer? — interactive grid (15 countries) */}
      <DestinationsGrid />

      {/* Decision factors */}
      <section className="section-padding bg-white pt-0" aria-label="How we help you decide">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl rounded-2xl bg-background-alt p-8 md:p-10">
            <h3 className="text-center text-lg font-semibold text-primary">
              We help you decide based on:
            </h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {decisionFactors.map((factor) => (
                <li
                  key={factor.text}
                  className="flex items-start gap-3 text-sm text-foreground-muted"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a853]/[0.12]">
                    <factor.icon
                      className="h-4 w-4 text-accent-dark"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1">{factor.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link href="/contact" className="btn btn-primary px-8 py-3">
                Contact Us
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study Abroad? */}
      <section
        className="section-padding bg-background-alt"
        aria-labelledby="why-abroad-heading"
      >
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Study Abroad
            </p>
            <h2
              id="why-abroad-heading"
              className="text-3xl font-bold text-primary md:text-4xl"
            >
              Why Study Abroad?
            </h2>
            <p className="mt-4 text-foreground-muted">
              Studying abroad is more than earning a degree—it&apos;s a
              transformative experience that shapes your future in profound
              ways.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyStudyAbroad.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-xl border border-border-light bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-250 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/[0.08]">
                  <item.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact" className="btn btn-outline px-8 py-3">
              Contact Us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="section-padding bg-background-alt"
        aria-labelledby="testimonials-heading"
      >
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Student Stories
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl font-bold text-primary md:text-4xl"
            >
              What Our Students Say
            </h2>
            <p className="mt-4 text-foreground-muted">
              Hear from students who turned their study abroad dreams into
              reality with our guidance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="flex flex-col rounded-xl border border-border-light bg-white p-6 shadow-[var(--shadow-sm)]"
              >
                <div className="mb-3 flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#d4a853] text-[#d4a853]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground-muted italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-4 border-t border-border-light pt-4">
                  <p className="font-semibold text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-foreground-subtle">
                    {testimonial.university} &middot; {testimonial.country}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="section-padding bg-primary text-white"
        aria-labelledby="cta-heading"
      >
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="cta-heading"
              className="text-3xl font-bold md:text-4xl"
            >
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80 text-lg">
              Take the first step toward your international education. Book a
              free consultation and let&apos;s build your roadmap together.
            </p>
            <a
              href="/contact"
              className="btn btn-accent mt-8 px-10 py-3.5 text-base font-semibold"
            >
              Book Your Free Consultation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
