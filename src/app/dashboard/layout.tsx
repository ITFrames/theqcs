import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, toPublicUser } from "@/lib/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await db.getProfile(user.id);
  // Nudge students who registered but never finished onboarding.
  if (!profile?.onboardingComplete) redirect("/onboarding");

  return <DashboardShell user={toPublicUser(user)}>{children}</DashboardShell>;
}
