import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";

export const getArticle = publicProcedure
  .input(z.object({ slug: z.string(), locale: z.string() }))
  .query(async ({ ctx, input }) => {
    const {
      content,
      id,
      slug,
      title,
      updatedAt,
      description,
      coverPhotoPublicId,
    } = await ctx.prisma.article.findUniqueOrThrow({
      where: { slug: input.slug },
      include: {
        title: {
          include: {
            Translation: { where: { languageId: input.locale } },
          },
        },
        content: {
          include: {
            Translation: { where: { languageId: input.locale } },
          },
        },
      },
    });

    const contentForLocale = content.Translation.at(0)?.content;
    const titleForLocale = title.Translation.at(0)?.content;

    if (!contentForLocale || !titleForLocale) {
      return null;
    }

    return {
      title: titleForLocale,
      content: contentForLocale,
      id,
      slug,
      updatedAt,
      description,
      coverPhotoPublicId,
    };
  });
