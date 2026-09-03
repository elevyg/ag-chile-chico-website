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

const mysqlTableNameByLower = new Map(
  (
    await mysqlConn.query("SHOW TABLES")
  )[0].map((row) => {
    const name = Object.values(row)[0];
    return [String(name).toLowerCase(), String(name)];
  })
);

async function mysqlCount(tableLowerName) {
  const table = mysqlTableNameByLower.get(tableLowerName) ?? tableLowerName;
  const [rows] = await mysqlConn.query(`SELECT COUNT(*) as c FROM \`${table}\``);
  return rows[0]?.c ?? 0;
}

const results = {
  mysql: {
    language: await mysqlCount("language"),
    textContent: await mysqlCount("textcontent"),
    translation: await mysqlCount("translation"),
    user: await mysqlCount("user"),
    account: await mysqlCount("account"),
    session: await mysqlCount("session"),
    verificationToken: await mysqlCount("verificationtoken"),
    article: await mysqlCount("article"),
  },
  turso: {
    language: await prisma.language.count(),
    textContent: await prisma.textContent.count(),
    translation: await prisma.translation.count(),
    user: await prisma.user.count(),
    account: await prisma.account.count(),
    session: await prisma.session.count(),
    verificationToken: await prisma.verificationToken.count(),
    article: await prisma.article.count(),
  },
};

console.log(JSON.stringify(results, null, 2));

await mysqlConn.end();
await prisma.$disconnect();

