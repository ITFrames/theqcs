import { OG_ALT, OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

// Route segment config — must be statically declared here (not re-exported).
export const runtime = "nodejs";
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Twitter/X card image — same design as the Open Graph image. */
export default function TwitterImage() {
  return renderOgImage();
}
