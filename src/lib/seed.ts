/**
 * Seed data — realistic starter content so a new student sees a populated
 * dashboard on first login. Shared by both the in-memory and Supabase stores.
 */

import { randomUUID } from "node:crypto";
import type { Application, StudentDocument } from "./types";

export function seedApplications(userId: string): Application[] {
  return [
    {
      id: randomUUID(),
      userId,
      university: "University of Toronto",
      program: "MSc Computer Science",
      country: "Canada",
      flag: "🇨🇦",
      intake: "Fall 2026",
      applicationId: "QCS-APP-1042",
      status: "University Reviewing",
    },
    {
      id: randomUUID(),
      userId,
      university: "University of Manchester",
      program: "MSc Data Science",
      country: "United Kingdom",
      flag: "🇬🇧",
      intake: "Sept 2026",
      applicationId: "QCS-APP-1043",
      status: "Documents Required",
    },
    {
      id: randomUUID(),
      userId,
      university: "University of Melbourne",
      program: "Master of IT",
      country: "Australia",
      flag: "🇦🇺",
      intake: "Feb 2027",
      applicationId: "QCS-APP-1044",
      status: "Shortlisted",
    },
  ];
}

export function seedDocuments(userId: string): StudentDocument[] {
  const mk = (
    category: string,
    name: string,
    status: StudentDocument["status"],
  ): StudentDocument => ({ id: randomUUID(), userId, category, name, status });

  return [
    mk("Identity", "Passport", "Verified"),
    mk("Identity", "Photograph", "Verified"),
    mk("Academic", "10th Certificate", "Verified"),
    mk("Academic", "12th Certificate", "Verified"),
    mk("Academic", "Bachelor's Degree", "Under Review"),
    mk("Academic", "Transcripts", "Action Required"),
    mk("English Proficiency", "IELTS / TOEFL / PTE / Duolingo", "Verified"),
    mk("Financial", "Bank Statements", "Under Review"),
    mk("Financial", "Education Loan Documents", "Not Uploaded"),
    mk("Application", "Statement of Purpose", "Verified"),
    mk("Application", "Resume / CV", "Verified"),
    mk("Application", "Letters of Recommendation", "Not Uploaded"),
  ];
}
