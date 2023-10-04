import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";

export const getAll = publicProcedure
  .input(z.object({ locale: z.string().optional() }))
  .query(async ({ ctx, input: { locale = "es" } }) => {
    const articles = await ctx.prisma.article.findMany({
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
      },
    });

    return articles.map((article) => ({
      ...article,
      content: article.content.Translation[0]?.content,
      title: article.title.Translation[0]?.content,
    }));
  });
