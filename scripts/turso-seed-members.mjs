// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const agMembers = {
  "h-de-la-patagonia": {
    name: "H de la Patagonia",
    placeId: "ChIJY-YrKz4r7b0RsqE46gSZzIc",
  },
  "brisas-del-lago": {
    name: "Brisas del Lago",
    placeId: "ChIJaaoRokYr7b0REjgJTQrZ7-M",
  },
  "costanera-apart": {
    name: "Costanera Apart",
    placeId: "ChIJ9Qzx86Qr7b0R0dYTCLoQJUQ",
  },
  "cabañas-el-engaño": {
    name: "Cabañas El Engaño",
    placeId: "ChIJifhlQmwr7b0R9HSGzXZcklA",
  },
  "cabañas-frau-schuster": {
    name: "Cabañas Frau Schuster",
    placeId: "ChIJrZq5k0gr7b0Rk4ZHq8cqMkk",
  },
  "chile-chico-explora": {
    name: "Chile Chico Explora",
    placeId: "ChIJbVP2IEQr7b0Rqz8LOgUMdf8",
  },
  "turismo-tramal": {
    name: "Turismo Tramal",
    placeId:
      "EjFNYW51ZWwgUm9kcsOtZ3VleiA0NDMsIENoaWxlIENoaWNvLCBBeXPDqW4sIENoaWxlIjESLwoUChIJt5eqmUYr7b0R4oYfNWy-yAoQuwMqFAoSCYsigc5FK-29EUFDVm7uin4E",
  },
  "kon-aiken": {
    name: "Kon Aiken Turismo",
    placeId: "ChIJ3bqoIUQr7b0RvcpfcX5mq78",
  },
  "rincon-soleado": {
    name: "Cabañas Rincón Soleado",
    placeId: "ChIJnwhHEq4r7b0RMsCscZg_JqE",
  },
  "posada-del-rio": {
    name: "Hotel Posada del Río",
    placeId: "ChIJIR0JO0cr7b0R5QSQ9F50pzA",
  },
  "roca-pampa": {
    name: "Cabalgatas Roca Pampa",
    placeId: "ChIJf1ZkfTUr7b0RrU5bVg5DjSA",
  },
};

const url =
  process.env.TURSO_SEED_DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken =
  process.env.TURSO_SEED_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Missing Turso URL / auth token.");
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url, authToken }),
});

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const members = [];

for (const [slug, member] of Object.entries(agMembers)) {
  let address = null;
  let mapsUrl = null;
  if (mapsKey) {
    try {
      const detailsUrl = new URL(
        "https://maps.googleapis.com/maps/api/place/details/json",
      );
      detailsUrl.searchParams.set("place_id", member.placeId);
      detailsUrl.searchParams.set("fields", "formatted_address,url");
      detailsUrl.searchParams.set("key", mapsKey);
      const response = await fetch(detailsUrl);
      const payload = await response.json();
      address = payload.result?.formatted_address ?? null;
      mapsUrl = payload.result?.url ?? null;
    } catch (error) {
      console.warn(`Could not enrich ${member.name}:`, error.message);
    }
  }

  members.push({
    slug,
    name: member.name,
    placeId: member.placeId,
    address,
    mapsUrl,
    sortOrder: members.length,
    isPublished: true,
  });
}

try {
  await prisma.member.deleteMany();
  await prisma.member.createMany({ data: members });
  const count = await prisma.member.count();
  console.log(`Seeded ${count} members into Turso.`);
} finally {
  await prisma.$disconnect();
}
