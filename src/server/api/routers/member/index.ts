import { z } from "zod";
import { slugify } from "~/utils/slugify";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const memberInput = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  placeId: z.string().min(1),
  address: z.string().optional(),
  mapsUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

export const memberRouter = createTRPCRouter({
  listPublished: publicProcedure.query(({ ctx }) =>
    ctx.prisma.member.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ),

  listAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.member.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ),

  upsert: protectedAdminProcedure
    .input(memberInput)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.slug?.trim() || input.name);
      const data = {
        name: input.name.trim(),
        slug,
        placeId: input.placeId.trim(),
        address: input.address?.trim() || null,
        mapsUrl: input.mapsUrl?.trim() || null,
        sortOrder: input.sortOrder ?? 0,
        isPublished: input.isPublished ?? true,
      };

      if (input.id) {
        return ctx.prisma.member.update({
          where: { id: input.id },
          data,
        });
      }

      return ctx.prisma.member.create({ data });
    }),

  delete: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.member.delete({ where: { id: input.id } }),
    ),
});
