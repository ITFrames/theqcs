import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - QCS ABROAD",
  description:
    "How QCS ABROAD collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "We collect information you provide directly to us, such as when you fill out a consultation form, create a student account, or contact us. This may include your name, email address, phone number, date of birth, nationality, educational background, and details about your study abroad goals.",
      "To support your applications, we also collect academic and identity documents you choose to share with us — for example, academic transcripts and certificates, degree/mark sheets, passport and identity documents, English proficiency test scores (IELTS/TOEFL/PTE), statements of purpose, letters of recommendation, resumes/CVs, and financial or sponsorship documents.",
      "We also automatically collect certain technical information when you visit our website, including your IP address, browser type, device information, and pages visited, through cookies and similar technologies.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "We use the information and documents we collect to provide and improve our services, respond to your inquiries, match you with suitable universities and programs, prepare and submit applications on your behalf, and communicate with you about your study abroad journey.",
      "We may also use your information to send you relevant updates, educational resources, and promotional content, which you can opt out of at any time.",
    ],
  },
  {
    title: "3. How We Share Your Information & Documents",
    body: [
      "A core part of our service is helping you apply to educational institutions. To do this, and with your authorization, we share your personal information and supporting documents with the third parties necessary to process your admission and related requirements.",
      "We share only the information and documents necessary for each specific purpose, and we require these parties to handle your data responsibly. We do not sell your personal information to third parties.",
      "We may also share information with trusted service providers who help us operate our website and deliver our services, subject to confidentiality obligations, and where required by law or to comply with a legal obligation.",
      "The parties we may share your information and documents with include:",
    ],
    bullets: [
      "Colleges, universities, and educational institutions you are applying to",
      "Admission offices, application platforms, and university representatives",
      "Government departments and embassies/consulates for visa and immigration processing",
      "Test and credential-verification bodies (e.g., IELTS/TOEFL, credential assessment agencies)",
      "Accommodation, insurance, and financial/sponsorship providers where you request such services",
    ],
  },
  {
    title: "4. Your Consent & Authorization",
    body: [
      "By engaging our services and submitting your documents, you authorize QCS ABROAD to share the relevant information and documents with the institutions and authorities listed above for the purpose of processing your applications and admission requirements. You may withdraw this consent at any time by contacting us, though doing so may prevent us from continuing certain services.",
    ],
  },
  {
    title: "5. Data Security",
    body: [
      "We implement appropriate technical and organizational measures to protect your personal information and documents against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "We retain your personal information and documents only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your data as described below.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      "You have the right to access, correct, or delete your personal information, and to withdraw consent for document sharing. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us using the details below.",
    ],
  },
  {
    title: "8. Cookies & Tracking Technologies",
    body: [
      "We use cookies and similar technologies to operate our website, understand how it is used, and — with your consent — to measure and deliver relevant advertising. We group cookies into three categories:",
    ],
    bullets: [
      "Strictly necessary — required for core functionality such as signing in, keeping your session secure, and remembering your cookie choices. These are always active and do not require consent.",
      "Analytics — help us understand traffic and how visitors use the site so we can improve it. Loaded only if you accept analytics cookies.",
      "Advertising — used to show and measure relevant study-abroad ads across other sites and to attribute sign-ups and enquiries to campaigns. Loaded only if you accept advertising cookies.",
    ],
  },
  {
    title: "9. Consent & Third-Party Processors",
    body: [
      "When you first visit, we ask for your consent before loading any non-essential (analytics or advertising) cookies. Until you opt in, only strictly necessary cookies are used. We use Google Consent Mode so that Google tags respect your choice.",
      "Where you consent, non-essential technologies may be provided by the following processors:",
    ],
    bullets: [
      "Google (Google Analytics 4 & Google Ads) — website analytics and advertising/conversion measurement.",
      "Meta Platforms (Meta Pixel) — advertising and conversion measurement on Facebook and Instagram.",
      "Vercel (Vercel Analytics) — privacy-friendly, aggregate traffic analytics.",
    ],
  },
  {
    title: "10. Managing or Withdrawing Consent",
    body: [
      "You can change or withdraw your cookie consent at any time — it is as easy to withdraw as it was to give. Use the \u201cCookie Preferences\u201d link in the website footer to re-open the consent settings and update your choices, or use \u201cReject all\u201d to disable analytics and advertising cookies. You can also block or delete cookies through your browser settings.",
      "We do not use the sensitive documents you share with us (such as passports, transcripts, or financial documents) for advertising or profiling.",
    ],
  },
  {
    title: "11. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
    ],
  },
  {
    title: "12. Contact Us",
    body: [
      "If you have any questions about this Privacy Policy or how we handle your data and documents, please contact us at contact@theqcs.ca.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-primary section-padding text-white">
        <div className="container-narrow text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-white/80">Last updated: August 28, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow max-w-3xl">
          <p className="text-foreground-muted mb-10 leading-relaxed">
            At QCS ABROAD, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website or use our services.
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-primary mb-3 text-xl font-bold md:text-2xl">
                  {section.title}
                </h2>
                {section.body.map((para, i) => (
                  <p
                    key={i}
                    className="text-foreground-muted mb-3 leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
                {"bullets" in section && section.bullets && (
                  <ul className="mt-1 mb-3 space-y-2">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-foreground-muted flex items-start gap-3 leading-relaxed"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                          aria-hidden="true"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
