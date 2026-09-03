import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

const TRACKING_TABLE = "_applied_migrations";

const BASELINE_TABLE = {
  "20260903152403_init": "User",
  "20260903172433_add_members": "Member",
  "20260903183000_add_site_settings": "SiteSetting",
};

const splitStatements = (sql) =>
  sql
    .replace(/\r\n/g, "\n")
    .split(/;\s*\n/g)
    .flatMap((part, idx, arr) => {
      const trimmed = part.trim();
      if (!trimmed) return [];
      if (idx < arr.length - 1) return [`${trimmed};`];
      return [trimmed.endsWith(";") ? trimmed : `${trimmed};`];
    });

const resolveDatabase = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const hasTurso =
    typeof tursoUrl === "string" &&
    tursoUrl.length > 0 &&
    typeof tursoToken === "string" &&
    tursoToken.length > 0;

  if (hasTurso) {
    return {
      label: "turso",
      url: tursoUrl,
      authToken: tursoToken,
    };
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Vercel build needs TURSO_DATABASE_URL and TURSO_AUTH_TOKEN available at build time.",
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL (or Turso credentials).");
  }

  return {
    label: "sqlite",
    url: databaseUrl.startsWith("file:")
      ? `file:${path.resolve(databaseUrl.replace(/^file:/, ""))}`
      : databaseUrl,
  };
};

const tableExists = async (client, tableName) => {
  const result = await client.execute({
    sql: "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    args: [tableName],
  });
  return result.rows.length > 0;
};

const listMigrationFolders = () => {
  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  return fs
    .readdirSync(migrationsDir)
    .map((name) => {
      const fullPath = path.join(migrationsDir, name);
      return {
        name,
        fullPath,
        isDir: fs.statSync(fullPath).isDirectory(),
      };
    })
    .filter((entry) => entry.isDir)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      const sqlPath = path.join(entry.fullPath, "migration.sql");
      if (!fs.existsSync(sqlPath)) {
        throw new Error(`Missing migration.sql at ${sqlPath}`);
      }
      const sql = fs.readFileSync(sqlPath, "utf8").trim();
      if (sql.length === 0) {
        throw new Error(`Empty migration.sql at ${sqlPath}`);
      }
      return { name: entry.name, statements: splitStatements(sql) };
    });
};

if (process.env.SKIP_DB_MIGRATE === "1") {
  console.log("Skipping database migrations (SKIP_DB_MIGRATE=1).");
  process.exit(0);
}

const db = resolveDatabase();
const client = createClient({
  url: db.url,
  authToken: db.authToken,
});
const migrations = listMigrationFolders();

if (migrations.length === 0) {
  throw new Error("No migrations found in prisma/migrations.");
}

await client.execute(`
  CREATE TABLE IF NOT EXISTS ${TRACKING_TABLE} (
    name TEXT NOT NULL PRIMARY KEY,
    applied_at TEXT NOT NULL
  )
`);

const appliedResult = await client.execute(
  `SELECT name FROM ${TRACKING_TABLE}`,
);
const applied = new Set(appliedResult.rows.map((row) => String(row.name)));

for (const migration of migrations) {
  if (applied.has(migration.name)) continue;

  const baselineTable = BASELINE_TABLE[migration.name];
  if (baselineTable && (await tableExists(client, baselineTable))) {
    await client.execute({
      sql: `INSERT INTO ${TRACKING_TABLE} (name, applied_at) VALUES (?, ?)`,
      args: [migration.name, new Date().toISOString()],
    });
    applied.add(migration.name);
    console.log(`Baselined ${migration.name} (${baselineTable} already exists)`);
    continue;
  }

  console.log(
    `Applying ${migration.name} on ${db.label} (${migration.statements.length} statements)`,
  );

  await client.batch(
    [
      ...migration.statements.map((sql) => ({ sql })),
      {
        sql: `INSERT INTO ${TRACKING_TABLE} (name, applied_at) VALUES (?, ?)`,
        args: [migration.name, new Date().toISOString()],
      },
    ],
    "write",
  );
  applied.add(migration.name);
}

console.log(`Migrations up to date on ${db.label}.`);
