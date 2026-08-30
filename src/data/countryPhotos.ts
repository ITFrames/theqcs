/**
 * Country card photos.
 *
 * Real, licensed photos for the blog country cards live in `public/blog/` and
 * are named `<slug>.webp` (e.g. `public/blog/study-in-canada.webp`).
 *
 * HOW TO ADD A PHOTO:
 *   1. Download a licensed landscape image (Unsplash/Pexels are free; keep the
 *      attribution/license). Aim for ~1200x675 (16:9).
 *   2. Compress it and save as WebP at: public/blog/<slug>.webp
 *      (You can run: cwebp -q 80 input.jpg -o public/blog/<slug>.webp)
 *   3. Add the slug to COUNTRY_PHOTOS below.
 *
 * Any slug NOT listed here automatically falls back to the SVG landmark
 * illustration, so the grid always looks complete with no broken images.
 */

export const COUNTRY_PHOTOS = new Set<string>([
  "study-in-canada",
  "study-in-usa",
  "study-in-uk",
  "study-in-australia",
  "study-in-new-zealand",
  "study-in-germany",
  "study-in-ireland",
  "study-in-france",
  "study-in-netherlands",
  "study-in-italy",
  "study-in-spain",
  "study-in-sweden",
  "study-in-switzerland",
  "study-in-singapore",
]);

export function hasPhoto(slug: string): boolean {
  return COUNTRY_PHOTOS.has(slug);
}

export function photoPath(slug: string): string {
  return `/blog/${slug}.webp`;
}
