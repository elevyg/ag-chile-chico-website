import { z } from "zod";
import { protectedAdminProcedure } from "~/server/api/trpc";

export const hardDelete = protectedAdminProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.article.delete({
      where: { id: input.id },
    });
  });
