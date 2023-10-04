import { z } from "zod";
import { protectedAdminProcedure } from "~/server/api/trpc";

export const softDeleteArticle = protectedAdminProcedure
  .input(z.object({ id: z.string(), restore: z.boolean().optional() }))
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.article.update({
      where: { id: input.id },
      data: { isDeleted: input.restore ? false : true },
    }),
  );
