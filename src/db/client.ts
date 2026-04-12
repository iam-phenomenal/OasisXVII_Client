// Shared with Oasis_XVII_Admin/src/db/ - keep in sync until monorepo refactor
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;

  if (!value) {
    throw new Error("Missing required env var: DATABASE_URL");
  }

  return value;
}

export function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const sql = neon(getDatabaseUrl());
  cachedDb = drizzle(sql, { schema });
  return cachedDb;
}
