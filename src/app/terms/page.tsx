import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - QCS ABROAD",
  description:
    "The terms and conditions governing your use of QCS ABROAD's website and services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "QCS ABROAD is operated by its parent company, 13115984 Canada Inc. References to \"QCS ABROAD,\" \"we,\" \"us,\" or \"our\" in these Terms refer to 13115984 Canada Inc. and its brand QCS ABROAD.",
      "By accessing or using the QCS ABROAD website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.",
    ],
  },
  {
    title: "2. Our Services",
    body: [
      "QCS ABROAD provides education consultancy services, including university selection and admission guidance, visa assistance, test preparation, scholarship guidance, and pre- and post-departure support. Our services are advisory in nature.",
      "While we strive to provide accurate and helpful guidance, we do not guarantee admission to any institution, the granting of any visa, or any specific outcome, as these decisions rest with the respective institutions and authorities.",
    ],
  },
  {
    title: "3. Your Responsibilities",
    body: [
      "You agree to provide accurate, complete, and current information and documents when using our services. You are solely responsible for the truthfulness, authenticity, and validity of all documents and information you submit through us, including academic records, identity documents, and test scores.",
      "You agree to use our services only for lawful purposes and in accordance with these terms.",
    ],
  },
  {
    title: "4. Document Handling & Authorization",
    body: [
      "To deliver our services, you authorize QCS ABROAD to collect, process, and share your personal information and supporting documents with the third parties necessary to fulfil your admission and related requirements. These include colleges, universities, and educational institutions you apply to; admission offices, application platforms, and university representatives; government departments and embassies/consulates for visa processing; test and credential-verification bodies; and, where you request them, accommodation, insurance, and financial/sponsorship providers.",
      "We share only the documents and information necessary for each purpose, and we handle your data in accordance with our Privacy Policy. You may withdraw this authorization at any time by contacting us, though this may prevent us from continuing to process your applications.",
      "You confirm that you have the right to share any documents you provide, and that submitting fraudulent or falsified documents may result in the immediate termination of our services and rejection by institutions or authorities.",
    ],
  },
  {
    title: "5. Fees and Payments",
    body: [
      "Certain services may be subject to fees, which will be communicated to you clearly before you engage them. All fees are non-refundable unless otherwise stated in a separate written agreement.",
    ],
  },
  {
    title: "6. Intellectual Property",
    body: [
      "All content on this website, including text, graphics, logos, and images, is the property of QCS ABROAD and is protected by applicable intellectual property laws. You may not reproduce or distribute our content without prior written permission.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    body: [
      "QCS ABROAD shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services, including but not limited to decisions made by universities, visa authorities, or other third parties.",
    ],
  },
  {
    title: "8. Third-Party Links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or accuracy of information on those external sites.",
    ],
  },
  {
    title: "9. Changes to These Terms",
    body: [
      "We reserve the right to modify these Terms of Service at any time. Continued use of our services after changes are posted constitutes your acceptance of the revised terms.",
    ],
  },
  {
    title: "10. Governing Law",
    body: [
      "These terms are governed by the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions.",
    ],
  },
  {
    title: "11. Contact Us",
    body: [
      "If you have any questions about these Terms of Service, please contact us at contact@theqcs.ca.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-primary text-white section-padding">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-white/80">Last updated: August 28, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow max-w-3xl">
          <p className="text-foreground-muted leading-relaxed mb-10">
            Please read these Terms of Service carefully before using the QCS
            ABROAD website and services. These terms govern your relationship
            with QCS ABROAD.
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-3">
                  {section.title}
                </h2>
                {section.body.map((para, i) => (
                  <p
                    key={i}
                    className="text-foreground-muted leading-relaxed mb-3"
                  >
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
