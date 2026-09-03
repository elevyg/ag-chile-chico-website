-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "SiteSetting" ("key", "value", "createdAt", "updatedAt")
VALUES (
  'parkTicketsRedirectUrl',
  'https://tickets.pasesparques.cl/pt/events/parque-nacional-patagonia-sector-jeinimeni',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
