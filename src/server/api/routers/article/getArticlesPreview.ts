import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";

export const getArticlesPreview = publicProcedure
  .input(z.object({ locale: z.string() }))
  .query(async ({ ctx, input: { locale } }) => {
    const articles = await ctx.prisma.article.findMany({
      where: { isDeleted: false },
      select: {
        coverPhotoPublicId: true,
        slug: true,
        title: {
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

    return articles.map((article) => ({
      ...article,
      title: article.title.Translation[0]?.content,
      description: article.description?.Translation[0]?.content,
    }));
  });
