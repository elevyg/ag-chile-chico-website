import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const tursoDatabaseUrl = env.TURSO_DATABASE_URL;
    const tursoAuthToken = env.TURSO_AUTH_TOKEN;

    const hasTurso =
      typeof tursoDatabaseUrl === "string" &&
      tursoDatabaseUrl.length > 0 &&
      typeof tursoAuthToken === "string" &&
      tursoAuthToken.length > 0;

    const adapter = hasTurso
      ? new PrismaLibSql({
          url: tursoDatabaseUrl,
          authToken: tursoAuthToken,
        })
      : new PrismaLibSql({
          url: env.DATABASE_URL,
        });

    return new PrismaClient({ adapter });
  })();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
