// @ts-nocheck
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error(
    "Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in environment."
  );
}

const migrationsDir = path.join(process.cwd(), "prisma", "migrations");

const migrationFolders = fs
  .readdirSync(migrationsDir)
  .map((name) => {
    const fullPath = path.join(migrationsDir, name);
    const stat = fs.statSync(fullPath);
    return { name, fullPath, mtimeMs: stat.mtimeMs, isDir: stat.isDirectory() };
  })
  .filter((x) => x.isDir)
  .sort((a, b) => b.mtimeMs - a.mtimeMs);

if (migrationFolders.length === 0) {
  throw new Error(`No migrations found in ${migrationsDir}`);
}

const latest = migrationFolders[0];
if (!latest) {
  throw new Error("No migrations found to apply.");
}
const migrationSqlPath = path.join(latest.fullPath, "migration.sql");

if (!fs.existsSync(migrationSqlPath)) {
  throw new Error(`Missing migration.sql at ${migrationSqlPath}`);
}

const sql = fs.readFileSync(migrationSqlPath, "utf8").trim();
if (sql.length === 0) {
  throw new Error(`Empty migration.sql at ${migrationSqlPath}`);
}

const statements = sql
  .replace(/\r\n/g, "\n")
  .split(/;\s*\n/g)
  .flatMap((part, idx, arr) => {
    const trimmed = part.trim();
    if (!trimmed) return [];
    if (idx < arr.length - 1) return [`${trimmed};`];
    return [trimmed];
  });

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

console.log(`Applying schema: ${latest.name} (${statements.length} statements)`);

await client.batch(statements.map((s) => ({ sql: s })), "write");

console.log("Schema applied.");

