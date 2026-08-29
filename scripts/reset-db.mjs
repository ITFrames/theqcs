/**
 * QCS ABROAD — reset the shared Supabase database.
 *
 * Deletes all rows from every student-data table (schema stays intact) so you
 * can clear test data before launch. Uses the Supabase PostgREST endpoint with
 * the service role key — no extra dependency.
 *
 * Usage:
 *   node scripts/reset-db.mjs            # prompts for confirmation
 *   node scripts/reset-db.mjs --yes      # skip confirmation
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the
 * environment (loaded from .env.local below).
 */

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

// Minimal .env.local loader (no dependency).
function loadEnv() {
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
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
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "This script only works once your Supabase project is configured.",
  );
  process.exit(1);
}

// Child tables first so foreign keys don't block deletes.
const TABLES = [
  "shortlist",
  "documents",
  "applications",
  "profiles",
  "otps",
  "users",
];

async function confirm() {
  if (process.argv.includes("--yes")) return true;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const host = new URL(url).host;
  const answer = await new Promise((resolve) =>
    rl.question(
      `\n⚠️  This will DELETE ALL student data from ${host}.\nType "wipe" to continue: `,
      resolve,
    ),
  );
  rl.close();
  return String(answer).trim().toLowerCase() === "wipe";
}

async function deleteAll(table) {
  // PostgREST requires a filter to delete; `id=not.is.null` matches every row.
  // `otps` has no `id` column, so filter on its `email` primary-key component.
  const filter = table === "otps" ? "email=not.is.null" : "id=not.is.null";
  const res = await fetch(`${url}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Failed to clear "${table}" (${res.status}): ${detail}`);
  }
}

async function main() {
  if (!(await confirm())) {
    console.log("Aborted. No data was deleted.");
    return;
  }
  for (const table of TABLES) {
    process.stdout.write(`Clearing ${table}… `);
    await deleteAll(table);
    console.log("done");
  }
  console.log("\n✅ Database wiped. Schema left intact.");
}

main().catch((err) => {
  console.error("\n❌", err.message);
  process.exit(1);
});
