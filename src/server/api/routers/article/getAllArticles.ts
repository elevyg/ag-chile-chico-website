import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";

export const getAll = publicProcedure
  .input(
    z.object({
      locale: z.string().optional(),
      showDeleted: z.boolean().optional(),
    }),
  )
  .query(async ({ ctx, input: { locale = "es", showDeleted } }) => {
    const articles = await ctx.prisma.article.findMany({
      where: { isDeleted: showDeleted },
      orderBy: { updatedAt: "desc" },
      include: {
        title: {
          select: {
            Translation: {
              where: { languageId: locale },
              select: { content: true },
            },
          },
        },
        content: {
          select: {
            Translation: {
              where: { languageId: locale },
              select: { content: true },
            },
          },
        },
        description: {
          select: {
            Translation: {
              where: { languageId: locale },
              select: { content: true },
            },
          },
        },
      },
    });

    return articles
      .map((article) => ({
        ...article,
        content: article.content.Translation[0]?.content,
        title: article.title.Translation[0]?.content,
        description: article.description?.Translation[0]?.content,
      }))
      .sort((a, b) => (a.isDeleted ? 1 : 0) - (b.isDeleted ? 1 : 0));
  });
