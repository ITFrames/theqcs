/**
 * Header (server component).
 *
 * Resolves the user's auth state on the server from the session cookie, so the
 * correct Login/Register vs Dashboard/Sign-out buttons are present in the very
 * first HTML render — no client fetch, no flash/delay on page load. The
 * interactive behaviour (mobile menu, scroll styling, logout) lives in the
 * client child, HeaderClient.
 */

import { getCurrentUser } from "@/lib/session";
import HeaderClient from "@/components/HeaderClient";

export default async function Header() {
  const user = await getCurrentUser();
  return <HeaderClient initialAuthed={!!user} />;
}
