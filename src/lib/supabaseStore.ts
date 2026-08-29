/**
 * QCS ABROAD — Supabase-backed data store.
 *
 * Implements the same async API as the in-memory store in `db.ts`, mapping 1:1
 * to the tables in `supabase/schema.sql`. Selected automatically by `db.ts`
 * when NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are configured.
 *
 * Uses the service-role key, so this module must only ever be imported by
 * server-side code (route handlers) — never in a client component.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./password";
import type {
  Application,
  OtpRecord,
  StudentDocument,
  StudentProfile,
  User,
} from "./types";
import { seedApplications, seedDocuments } from "./seed";

let client: SupabaseClient | null = null;

function sb(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

/* ---- row <-> domain mappers ---------------------------------------------- */

interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  email_verified: boolean;
  created_at: string;
}

function rowToUser(r: UserRow): User {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone,
    passwordHash: r.password_hash,
    emailVerified: r.email_verified,
    createdAt: r.created_at,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProfile(r: any): StudentProfile {
  return {
    userId: r.user_id,
    dateOfBirth: r.date_of_birth ?? undefined,
    gender: r.gender ?? undefined,
    nationality: r.nationality ?? undefined,
    currentCountry: r.current_country ?? undefined,
    city: r.city ?? undefined,
    whatsapp: r.whatsapp ?? undefined,
    highestQualification: r.highest_qualification ?? undefined,
    institutionName: r.institution_name ?? undefined,
    fieldOfStudy: r.field_of_study ?? undefined,
    graduationYear: r.graduation_year ?? undefined,
    grade: r.grade ?? undefined,
    englishTest: r.english_test ?? undefined,
    englishScore: r.english_score ?? undefined,
    destinations: r.destinations ?? undefined,
    preferredProgram: r.preferred_program ?? undefined,
    studyLevel: r.study_level ?? undefined,
    preferredIntake: r.preferred_intake ?? undefined,
    expectedStartYear: r.expected_start_year ?? undefined,
    budget: r.budget ?? undefined,
    fundingMethod: r.funding_method ?? undefined,
    onboardingComplete: r.onboarding_complete ?? false,
    updatedAt: r.updated_at,
  };
}

function profileToRow(userId: string, p: Partial<StudentProfile>) {
  return {
    user_id: userId,
    date_of_birth: p.dateOfBirth ?? null,
    gender: p.gender ?? null,
    nationality: p.nationality ?? null,
    current_country: p.currentCountry ?? null,
    city: p.city ?? null,
    whatsapp: p.whatsapp ?? null,
    highest_qualification: p.highestQualification ?? null,
    institution_name: p.institutionName ?? null,
    field_of_study: p.fieldOfStudy ?? null,
    graduation_year: p.graduationYear ?? null,
    grade: p.grade ?? null,
    english_test: p.englishTest ?? null,
    english_score: p.englishScore ?? null,
    destinations: p.destinations ?? null,
    preferred_program: p.preferredProgram ?? null,
    study_level: p.studyLevel ?? null,
    preferred_intake: p.preferredIntake ?? null,
    expected_start_year: p.expectedStartYear ?? null,
    budget: p.budget ?? null,
    funding_method: p.fundingMethod ?? null,
    onboarding_complete: p.onboardingComplete ?? false,
    updated_at: new Date().toISOString(),
  };
}

function rowToApplication(r: any): Application {
  return {
    id: r.id,
    userId: r.user_id,
    university: r.university,
    program: r.program,
    country: r.country,
    flag: r.flag ?? "",
    intake: r.intake ?? "",
    applicationId: r.application_id,
    status: r.status,
  };
}

function rowToDocument(r: any): StudentDocument {
  return {
    id: r.id,
    userId: r.user_id,
    category: r.category,
    name: r.name,
    status: r.status,
    fileName: r.file_name ?? undefined,
    uploadedAt: r.uploaded_at ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ---- store --------------------------------------------------------------- */

export const supabaseStore = {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await sb()
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    return data ? rowToUser(data as UserRow) : undefined;
  },

  async createUser(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<User> {
    const id = randomUUID();
    const email = input.email.toLowerCase();
    const { data, error } = await sb()
      .from("users")
      .insert({
        id,
        first_name: input.firstName,
        last_name: input.lastName,
        email,
        phone: input.phone,
        password_hash: hashPassword(input.password),
        email_verified: false,
      })
      .select("*")
      .single();
    if (error) throw new Error(`createUser failed: ${error.message}`);

    await sb()
      .from("profiles")
      .upsert({ user_id: id, onboarding_complete: false });

    return rowToUser(data as UserRow);
  },

  async markEmailVerified(email: string): Promise<void> {
    await sb()
      .from("users")
      .update({ email_verified: true })
      .eq("email", email.toLowerCase());
  },

  /* OTP */
  async saveOtp(rec: OtpRecord): Promise<void> {
    await sb().from("otps").upsert(
      {
        email: rec.email.toLowerCase(),
        purpose: rec.purpose,
        code: rec.code,
        expires_at: new Date(rec.expiresAt).toISOString(),
        attempts: rec.attempts,
      },
      { onConflict: "email,purpose" },
    );
  },

  async getOtp(
    email: string,
    purpose: OtpRecord["purpose"],
  ): Promise<OtpRecord | undefined> {
    const { data } = await sb()
      .from("otps")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("purpose", purpose)
      .maybeSingle();
    if (!data) return undefined;
    return {
      email: data.email,
      purpose: data.purpose,
      code: data.code,
      expiresAt: new Date(data.expires_at).getTime(),
      attempts: data.attempts,
    };
  },

  async deleteOtp(email: string, purpose: OtpRecord["purpose"]): Promise<void> {
    await sb()
      .from("otps")
      .delete()
      .eq("email", email.toLowerCase())
      .eq("purpose", purpose);
  },

  /* Sessions — stored in a lightweight table keyed by token */
  async createSession(userId: string): Promise<string> {
    const token = randomUUID() + randomUUID().replace(/-/g, "");
    await sb().from("sessions").insert({ token, user_id: userId });
    return token;
  },

  async getSessionUser(token: string | undefined): Promise<User | undefined> {
    if (!token) return undefined;
    const { data: session } = await sb()
      .from("sessions")
      .select("user_id")
      .eq("token", token)
      .maybeSingle();
    if (!session) return undefined;
    const { data: user } = await sb()
      .from("users")
      .select("*")
      .eq("id", session.user_id)
      .maybeSingle();
    return user ? rowToUser(user as UserRow) : undefined;
  },

  async destroySession(token: string | undefined): Promise<void> {
    if (token) await sb().from("sessions").delete().eq("token", token);
  },

  /* Profiles */
  async getProfile(userId: string): Promise<StudentProfile | undefined> {
    const { data } = await sb()
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data ? rowToProfile(data) : undefined;
  },

  async updateProfile(
    userId: string,
    patch: Partial<StudentProfile>,
  ): Promise<StudentProfile> {
    const existing = await this.getProfile(userId);
    const merged = { ...(existing ?? {}), ...patch } as Partial<StudentProfile>;
    const { data, error } = await sb()
      .from("profiles")
      .upsert(profileToRow(userId, merged), { onConflict: "user_id" })
      .select("*")
      .single();
    if (error) throw new Error(`updateProfile failed: ${error.message}`);
    return rowToProfile(data);
  },

  /* Applications */
  async getApplications(userId: string): Promise<Application[]> {
    const { data } = await sb()
      .from("applications")
      .select("*")
      .eq("user_id", userId);
    if (data && data.length > 0) return data.map(rowToApplication);

    // Seed a realistic starter set on first access.
    const seeded = seedApplications(userId);
    await sb().from("applications").insert(
      seeded.map((a) => ({
        id: a.id,
        user_id: a.userId,
        university: a.university,
        program: a.program,
        country: a.country,
        flag: a.flag,
        intake: a.intake,
        application_id: a.applicationId,
        status: a.status,
      })),
    );
    return seeded;
  },

  /* Documents */
  async getDocuments(userId: string): Promise<StudentDocument[]> {
    const { data } = await sb()
      .from("documents")
      .select("*")
      .eq("user_id", userId);
    if (data && data.length > 0) return data.map(rowToDocument);

    const seeded = seedDocuments(userId);
    await sb().from("documents").insert(
      seeded.map((d) => ({
        id: d.id,
        user_id: d.userId,
        category: d.category,
        name: d.name,
        status: d.status,
        file_name: d.fileName ?? null,
        uploaded_at: d.uploadedAt ?? null,
      })),
    );
    return seeded;
  },

  async setDocumentStatus(
    userId: string,
    documentId: string,
    status: StudentDocument["status"],
    fileName?: string,
  ): Promise<StudentDocument[]> {
    await this.getDocuments(userId); // ensure seeded
    const patch: Record<string, unknown> = {
      status,
      uploaded_at: new Date().toISOString(),
    };
    if (fileName !== undefined) patch.file_name = fileName;
    await sb()
      .from("documents")
      .update(patch)
      .eq("user_id", userId)
      .eq("id", documentId);
    const { data } = await sb()
      .from("documents")
      .select("*")
      .eq("user_id", userId);
    return (data ?? []).map(rowToDocument);
  },

  /* Shortlist */
  async getShortlist(userId: string): Promise<string[]> {
    const { data } = await sb()
      .from("shortlist")
      .select("program_id")
      .eq("user_id", userId);
    return (data ?? []).map((r) => r.program_id as string);
  },

  async toggleShortlist(userId: string, programId: string): Promise<string[]> {
    const { data: existing } = await sb()
      .from("shortlist")
      .select("program_id")
      .eq("user_id", userId)
      .eq("program_id", programId)
      .maybeSingle();

    if (existing) {
      await sb()
        .from("shortlist")
        .delete()
        .eq("user_id", userId)
        .eq("program_id", programId);
    } else {
      await sb().from("shortlist").insert({ user_id: userId, program_id: programId });
    }
    return this.getShortlist(userId);
  },
};
