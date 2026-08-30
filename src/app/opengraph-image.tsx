import { OG_ALT, OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

// Route segment config — must be statically declared here.
export const runtime = "nodejs";
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Site-wide default Open Graph image (1200x630). */
export default function OpengraphImage() {
  return renderOgImage();
}
