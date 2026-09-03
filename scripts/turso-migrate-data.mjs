// @ts-nocheck
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const MYSQL_URL = process.env.MYSQL_URL;
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!MYSQL_URL) throw new Error("Missing MYSQL_URL in environment.");
if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error("Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN.");
}

const adapter = new PrismaLibSql({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });
const mysqlConn = await mysql.createConnection(MYSQL_URL);

if (process.env.RESET_TURSO === "true") {
  console.log("Resetting destination Turso tables...");
  await prisma.article.deleteMany({});
  await prisma.translation.deleteMany({});
  await prisma.textContent.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.language.deleteMany({});
  console.log("Reset OK.");
}

const toDate = (value) => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

async function copyModel({
  mysqlTable,
  prismaModelKey,
  fields,
  mapRow,
  batchSize = 500,
}) {
  const prismaModel = prisma[prismaModelKey];

  const selectFields = fields.map((f) => `\`${f}\``).join(", ");
  const [rows] = await mysqlConn.query(
    `SELECT ${selectFields} FROM \`${mysqlTable}\``
  );

  const data = rows.map(mapRow);
  const total = data.length;
  console.log(
    `Copying ${prismaModelKey}: ${mysqlTable} -> ${total} rows`
  );

  for (const part of chunk(data, batchSize)) {
    await prismaModel.createMany({
      data: part,
    });
  }
}

const mysqlTables = await mysqlConn.query("SHOW TABLES");
const tableRows = mysqlTables[0];
const tableNameByLower = new Map(
  tableRows.map((row) => {
    const name = Object.values(row)[0];
    return [String(name).toLowerCase(), String(name)];
  })
);

// Orden para respetar FK.
const order = [
  {
    mysqlTable: tableNameByLower.get("language") ?? "Language",
    prismaModelKey: "language",
    fields: ["languageId", "languageName", "createdAt", "updatedAt"],
    mapRow: (r) => ({
      languageId: r.languageId,
      languageName: r.languageName,
      createdAt: toDate(r.createdAt) ?? new Date(0),
      updatedAt: toDate(r.updatedAt) ?? new Date(0),
    }),
  },
  {
    mysqlTable: tableNameByLower.get("textcontent") ?? "TextContent",
    prismaModelKey: "textContent",
    fields: ["id", "createdAt", "updatedAt"],
    mapRow: (r) => ({
      id: r.id,
      createdAt: toDate(r.createdAt) ?? new Date(0),
      updatedAt: toDate(r.updatedAt) ?? new Date(0),
    }),
  },
  {
    mysqlTable: tableNameByLower.get("translation") ?? "Translation",
    prismaModelKey: "translation",
    fields: [
      "id",
      "createdAt",
      "updatedAt",
      "textContentId",
      "content",
      "translation",
      "languageId",
    ],
    mapRow: (r) => ({
      id: r.id,
      createdAt: toDate(r.createdAt) ?? new Date(0),
      updatedAt: toDate(r.updatedAt) ?? new Date(0),
      textContentId: r.textContentId,
      content: r.content,
      translation: r.translation,
      languageId: r.languageId,
    }),
  },
  {
    mysqlTable: tableNameByLower.get("user") ?? "User",
    prismaModelKey: "user",
    fields: [
      "id",
      "name",
      "email",
      "emailVerified",
      "image",
      "role",
    ],
    mapRow: (r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      emailVerified: toDate(r.emailVerified),
      image: r.image,
      role: r.role,
    }),
  },
  {
    mysqlTable: tableNameByLower.get("account") ?? "Account",
    prismaModelKey: "account",
    fields: [
      "id",
      "userId",
      "type",
      "provider",
      "providerAccountId",
      "refresh_token",
      "access_token",
      "expires_at",
      "token_type",
      "scope",
      "id_token",
      "session_state",
    ],
    mapRow: (r) => ({
      id: r.id,
      userId: r.userId,
      type: r.type,
      provider: r.provider,
      providerAccountId: r.providerAccountId,
      refresh_token: r.refresh_token,
      access_token: r.access_token,
      expires_at: r.expires_at,
      token_type: r.token_type,
      scope: r.scope,
      id_token: r.id_token,
      session_state: r.session_state,
    }),
  },
  {
    mysqlTable: tableNameByLower.get("session") ?? "Session",
    prismaModelKey: "session",
    fields: ["id", "sessionToken", "userId", "expires"],
    mapRow: (r) => ({
      id: r.id,
      sessionToken: r.sessionToken,
      userId: r.userId,
      expires: toDate(r.expires) ?? new Date(0),
    }),
  },
  {
    mysqlTable:
      tableNameByLower.get("verificationtoken") ?? "VerificationToken",
    prismaModelKey: "verificationToken",
    fields: ["identifier", "token", "expires"],
    mapRow: (r) => ({
      identifier: r.identifier,
      token: r.token,
      expires: toDate(r.expires) ?? new Date(0),
    }),
  },
  {
    mysqlTable: tableNameByLower.get("article") ?? "Article",
    prismaModelKey: "article",
    fields: [
      "id",
      "titleId",
      "descriptionId",
      "contentId",
      "slug",
      "authorId",
      "createdAt",
      "updatedAt",
      "coverPhotoPublicId",
      "isDeleted",
    ],
    mapRow: (r) => ({
      id: r.id,
      titleId: r.titleId,
      descriptionId: r.descriptionId,
      contentId: r.contentId,
      slug: r.slug,
      authorId: r.authorId,
      createdAt: toDate(r.createdAt) ?? new Date(0),
      updatedAt: toDate(r.updatedAt) ?? new Date(0),
      coverPhotoPublicId: r.coverPhotoPublicId,
      isDeleted: Boolean(r.isDeleted),
    }),
  },
];

try {
  for (const step of order) {
    await copyModel(step);
  }

  console.log("Data migration OK.");
} finally {
  await mysqlConn.end();
  await prisma.$disconnect();
}

