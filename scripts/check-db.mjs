/**
 * QCS ABROAD — verify the Supabase schema.
 *
 * Connects with the service-role key and checks that every table the app needs
 * exists (and the `documents` Storage bucket). Prints a clear ✓ / ✗ report.
 *
 * Usage:
 *   node scripts/check-db.mjs      (or: npm run db:check)
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
 * .env.local (loaded below). Read-only — it never modifies data.
 */

import { readFileSync } from "node:fs";

// Minimal .env.local loader (no dependency).
function loadEnv() {
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        // Strip surrounding quotes if present.
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env.local optional
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
  process.exit(1);
}

// Every table the app relies on.
const EXPECTED_TABLES = [
  "users",
  "otps",
  "profiles",
  "applications",
  "documents",
  "shortlist",
  "sessions",
  "email_suppressions",
];

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

/**
 * A table exists if a HEAD request to its PostgREST endpoint doesn't 404.
 * We use ?limit=0 + count so no rows are returned (read-only, fast).
 */
async function tableExists(table) {
  const res = await fetch(`${url}/rest/v1/${table}?limit=1`, {
    method: "GET",
    headers: { ...headers, Prefer: "count=none" },
  });
  if (res.ok) return { exists: true };
  // PostgREST returns 404 for an unknown table.
  if (res.status === 404) return { exists: false };
  const detail = await res.text().catch(() => "");
  // Some errors (e.g. permission) still mean the table exists.
  return { exists: res.status !== 404, note: `${res.status} ${detail.slice(0, 80)}` };
}

async function bucketExists(name) {
  const res = await fetch(`${url}/storage/v1/bucket/${name}`, {
    method: "GET",
    headers,
  });
  return res.ok;
}

async function main() {
  const host = new URL(url).host;
  console.log(`\nChecking Supabase schema on ${host}\n`);

  let missing = 0;
  for (const table of EXPECTED_TABLES) {
    const { exists, note } = await tableExists(table);
    if (exists) {
      console.log(`  ✓ ${table}`);
    } else {
      missing++;
      console.log(`  ✗ ${table}   MISSING${note ? ` (${note})` : ""}`);
    }
  }

  // Storage bucket (separate from SQL tables).
  console.log("");
  const hasBucket = await bucketExists("documents");
  console.log(
    hasBucket
      ? "  ✓ storage bucket: documents"
      : "  ✗ storage bucket: documents   MISSING (create a PRIVATE bucket)",
  );

  console.log("");
  if (missing === 0 && hasBucket) {
    console.log("✅ All tables and the documents bucket exist.\n");
  } else {
    console.log(
      `⚠️  ${missing} table(s) missing${hasBucket ? "" : " + documents bucket missing"}.\n` +
        "   Run supabase/migrate.sql in the Supabase SQL Editor to add missing tables,\n" +
        "   and create the private 'documents' bucket in Storage if needed.\n",
    );
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("\n❌", err.message);
  process.exit(1);
});
