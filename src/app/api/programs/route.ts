import { NextResponse } from "next/server";
import { db, PROGRAM_CATALOG } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** GET /api/programs — full catalog + this student's shortlisted program ids. */
export async function GET() {
  const user = await getCurrentUser();
  const shortlist = user ? await db.getShortlist(user.id) : [];
  return NextResponse.json({ programs: PROGRAM_CATALOG, shortlist });
}

/** POST /api/programs — toggle a program in the shortlist. Body: { programId }. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { programId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.programId) {
    return NextResponse.json(
      { error: "programId is required." },
      { status: 400 },
    );
  }

  const shortlist = await db.toggleShortlist(user.id, body.programId);
  return NextResponse.json({ shortlist });
}
