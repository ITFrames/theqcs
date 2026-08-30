import {
  Shield,
  Heart,
  Award,
  Eye,
  GraduationCap,
  Globe,
  Users,
  Trophy,
  Target,
  CheckCircle2,
} from "lucide-react";

const missionPoints = [
  "Empower students with accurate and timely international education information",
  "Provide personalized counseling and visa assistance",
  "Simplify overseas education decisions through structured, country-wise guidance",
  "Deliver exceptional student experiences measured by satisfaction and success",
];

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We uphold the highest ethical standards in every interaction, providing honest and transparent guidance to students and families.",
  },
  {
    icon: Heart,
    title: "Student-First",
    description:
      "Every decision we make is centered around what's best for the student. Your success is our success.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in our services, continuously improving our processes and outcomes for every student.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear communication, honest timelines, and upfront information — no hidden fees, no surprises.",
  },
];

const stats = [
  { value: "500+", label: "Students Guided", icon: GraduationCap },
  { value: "15+", label: "Destination Countries", icon: Globe },
  { value: "98%", label: "Visa Success Rate", icon: Trophy },
  { value: "Since 2021", label: "Trusted & Growing", icon: Users },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[var(--color-primary)] text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary-light)] opacity-80" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            About <span className="text-[var(--color-accent)]">QCS ABROAD</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/85 leading-relaxed">
            Empowering students to achieve their dreams of international
            education through expert guidance, personalized support, and
            unwavering dedication.
          </p>
        </div>
      </section>

      {/* Intro Statement */}
      <section className="section-padding bg-[var(--color-background-alt)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              Who We Are
            </h2>
            <p className="mt-4 text-2xl sm:text-3xl font-semibold text-[var(--color-primary)] leading-snug">
              Empowering students with accurate, relevant, and timely guidance
              for their global education journey
            </p>
            <p className="mt-6 text-[var(--color-foreground-muted)] leading-relaxed">
              QCS ABROAD is a Canadian-based education consultancy that believes
              every student deserves access to world-class education. We bridge
              the gap between ambition and opportunity — simplifying complex
              processes and offering personalized, end-to-end support at every
              step of the journey abroad.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Our Story
              </h2>
              <h3 className="mt-3 text-3xl font-bold text-[var(--color-primary)]">
                Built to Guide Global Ambitions
              </h3>
              <p className="mt-6 text-[var(--color-foreground-muted)] leading-relaxed">
                Quality Consulting Services, operating under the legal entity{" "}
                <span className="font-medium text-[var(--color-primary)]">
                  13115984 Canada Inc.
                </span>
                , is a Canadian-based education consulting company established in
                2021 with a clear mission: to empower students with accurate,
                relevant, and timely information to pursue their global education
                aspirations.
              </p>
              <p className="mt-4 text-[var(--color-foreground-muted)] leading-relaxed">
                We differentiate ourselves through a proactive, student-centric
                approach. Rather than offering one-size-fits-all guidance, we
                focus on understanding each student&apos;s individual goals,
                preferences, and circumstances. Our platform is thoughtfully
                designed to organize and deliver essential study-abroad
                information by country, enabling students to make informed
                decisions that align with their academic and career ambitions.
              </p>
              <p className="mt-4 text-[var(--color-foreground-muted)] leading-relaxed">
                We strive to bridge the gaps in overseas education planning by
                simplifying complex processes and providing end-to-end support.
                Our success is measured not just by enrollments, but by the
                satisfaction, confidence, and long-term success of the students
                we serve.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <GraduationCap className="h-16 w-16 mx-auto mb-4 text-[var(--color-accent)]" />
                  <p className="text-xl font-semibold">
                    Canadian-Based, Globally Focused
                  </p>
                  <p className="mt-2 text-white/75 text-sm">
                    Empowering student journeys since 2021
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-[var(--color-background-alt)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision */}
            <div className="rounded-2xl bg-white p-8 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-accent)]/15">
                <Eye className="h-7 w-7 text-[var(--color-accent-dark)]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-[var(--color-primary)]">
                Our Vision
              </h3>
              <p className="mt-4 text-[var(--color-foreground-muted)] leading-relaxed">
                To transform the study abroad services sector through continuous
                innovation — connecting students and educational institutions
                worldwide with trust, clarity, and purpose.
              </p>
            </div>

            {/* Mission */}
            <div className="rounded-2xl bg-white p-8 shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                <Target className="h-7 w-7 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-[var(--color-primary)]">
                Our Mission
              </h3>
              <ul className="mt-4 space-y-3">
                {missionPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[var(--color-foreground-muted)] leading-relaxed"
                  >
                    <CheckCircle2
                      className="mt-1 h-5 w-5 shrink-0 text-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-[var(--color-background-alt)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              Our Values
            </h2>
            <h3 className="mt-3 text-3xl font-bold text-[var(--color-primary)]">
              What Drives Us
            </h3>
            <p className="mt-4 max-w-2xl mx-auto text-[var(--color-foreground-muted)]">
              These core principles guide everything we do and define who we are
              as an organization.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-xl bg-white p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <value.icon className="h-7 w-7 text-[var(--color-primary)]" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-[var(--color-primary)]">
                  {value.title}
                </h4>
                <p className="mt-2 text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Achievements Section */}
      <section className="py-16 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              Our Achievements
            </h2>
            <h3 className="mt-3 text-3xl font-bold text-white">
              Numbers That Speak
            </h3>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 mb-4">
                  <stat.icon className="h-7 w-7 text-[var(--color-accent)]" />
                </div>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-white/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-primary)]">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-[var(--color-foreground-muted)]">
            Let us help you take the first step toward your international
            education goals. Book a free consultation today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/contact" className="btn btn-primary px-8 py-3">
              Get In Touch
            </a>
            <a href="/services" className="btn btn-outline px-8 py-3">
              Our Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
