import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, toPublicUser } from "@/lib/session";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getProfileCompleteness } from "@/lib/profileCompleteness";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Logged-in students can use the dashboard even with an incomplete profile.
  // We surface a "Profile incomplete" badge instead of forcing onboarding.
  const profile = await db.getProfile(user.id);
  const completeness = getProfileCompleteness(profile);

  return (
    <DashboardShell
      user={toPublicUser(user)}
      profileComplete={completeness.isComplete}
    >
      {children}
    </DashboardShell>
  );
}
