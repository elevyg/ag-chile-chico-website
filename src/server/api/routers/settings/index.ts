import { z } from "zod";
import { createTRPCRouter, protectedAdminProcedure } from "~/server/api/trpc";
import {
  DEFAULT_PARK_TICKETS_URL,
  PARK_TICKETS_REDIRECT_KEY,
  getParkTicketsRedirectUrl,
} from "~/server/parkTickets";

const parkTicketsUrl = z
  .string()
  .trim()
  .url("Tiene que ser una URL válida")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  }, "La URL tiene que ser http o https");

export const settingsRouter = createTRPCRouter({
  getParkTicketsRedirect: protectedAdminProcedure.query(async ({ ctx }) => ({
    url: await getParkTicketsRedirectUrl(ctx.prisma),
  })),

  updateParkTicketsRedirect: protectedAdminProcedure
    .input(z.object({ url: parkTicketsUrl }))
    .mutation(async ({ ctx, input }) => {
      const setting = await ctx.prisma.siteSetting.upsert({
        where: { key: PARK_TICKETS_REDIRECT_KEY },
        update: { value: input.url },
        create: {
          key: PARK_TICKETS_REDIRECT_KEY,
          value: input.url,
        },
      });

      return { url: setting.value || DEFAULT_PARK_TICKETS_URL };
    }),
});
