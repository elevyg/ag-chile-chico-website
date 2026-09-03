import { type PrismaClient } from "@prisma/client";

export const PARK_TICKETS_REDIRECT_KEY = "parkTicketsRedirectUrl";

export const DEFAULT_PARK_TICKETS_URL =
  "https://tickets.pasesparques.cl/pt/events/parque-nacional-patagonia-sector-jeinimeni";

export const getParkTicketsRedirectUrl = async (prisma: PrismaClient) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: PARK_TICKETS_REDIRECT_KEY },
    });
    const value = setting?.value.trim();
    return value && value.length > 0 ? value : DEFAULT_PARK_TICKETS_URL;
  } catch {
    return DEFAULT_PARK_TICKETS_URL;
  }
};
