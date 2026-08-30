/**
 * FloatingWhatsApp
 * A persistent WhatsApp contact button fixed to the bottom-right of every page,
 * letting visitors message QCS ABROAD directly. Uses the authentic WhatsApp
 * brand glyph and colour, with a subtle pulse to draw attention.
 */

const WHATSAPP_URL =
  "https://wa.me/16478903806?text=Hi+QCS+ABROAD%21+%F0%9F%91%8B%0A%0AI%27m+interested+in+studying+abroad+and+would+like+guidance+with+my+application.%0A%0A%F0%9F%8C%8D+Preferred+Country%3A%0A%F0%9F%8E%93+Program+%2F+Course%3A%0A%F0%9F%93%9A+Current+Qualification%3A%0A%F0%9F%93%85+Preferred+Intake%3A%0A%0APlease+help+me+understand+my+study+options+and+the+next+steps.%0A%0AThank+you%21";

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-[60] flex items-center gap-3 md:right-6 md:bottom-6"
    >
      {/* Tooltip / label (desktop) */}
      <span className="hidden rounded-full bg-white px-3 py-2 text-sm font-medium text-[var(--color-primary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 md:block">
        Chat with us
      </span>

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-200 group-hover:scale-105">
        {/* Pulsing ring */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
        {/* WhatsApp logo */}
        <svg
          viewBox="0 0 32 32"
          className="relative h-8 w-8"
          fill="#ffffff"
          aria-hidden="true"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.38L1.05 31.3l6.126-1.958A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0Zm9.31 22.598c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826 0-2.296 1.166-3.424 1.636-3.904.386-.394.848-.573 1.408-.573.18 0 .342.009.488.016.428.018.643.043.925.716.35.845 1.204 2.941 1.306 3.155.104.214.208.503.066.813-.132.32-.248.462-.462.71-.214.248-.418.438-.632.703-.196.23-.418.48-.17.91.248.42 1.102 1.818 2.366 2.944 1.63 1.452 2.95 1.906 3.42 2.104.35.146.766.112 1.02-.16.322-.35.716-.93 1.116-1.502.284-.41.642-.462 1.018-.32.384.132 2.43 1.146 2.846 1.354.416.208.692.31.794.482.104.176.104 1.012-.282 2.102Z" />
        </svg>
      </span>
    </a>
  );
}
