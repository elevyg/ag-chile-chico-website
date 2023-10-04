import { z } from "zod";
import { protectedAdminProcedure } from "~/server/api/trpc";

export const upsertArticle = protectedAdminProcedure
  .input(
    z.object({
      slug: z.string(),
      locale: z.string(),
      content: z.string(),
      coverPhotoPublicId: z.string().optional(),
      title: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const article = await ctx.prisma.article.findUnique({
      where: { slug: input.slug },
      include: {
        content: {
          select: {
            id: true,
          },
        },
        title: { select: { id: true } },
      },
    });

    if (article) {
      const updateArticle = ctx.prisma.article.update({
        where: { slug: input.slug },
        data: {
          coverPhotoPublicId: input.coverPhotoPublicId,
        },
      });

      const updateContent = ctx.prisma.translation.upsert({
        where: {
          uniqueLanguageTranslation: {
            textContentId: article.content.id,
            languageId: input.locale,
          },
        },
        update: { content: input.content },
        create: {
          content: input.content,
          languageId: input.locale,
          textContentId: article.content.id,
        },
      });

      const updateTitle = ctx.prisma.translation.upsert({
        where: {
          uniqueLanguageTranslation: {
            textContentId: article.title.id,
            languageId: input.locale,
          },
        },
        update: { content: input.title },
        create: {
          content: input.title,
          languageId: input.locale,
          textContentId: article.title.id,
        },
      });

      return ctx.prisma.$transaction([
        updateArticle,
        updateContent,
        updateTitle,
      ]);
    }

    return ctx.prisma.article.create({
      data: {
        slug: input.slug,
        // description: input.content ?? null,
        coverPhotoPublicId: input.coverPhotoPublicId,
        title: {
          create: {
            Translation: {
              create: {
                content: input.title,
                languageId: input.locale,
              },
            },
          },
        },
        content: {
          create: {
            Translation: {
              create: {
                content: input.content,
                languageId: input.locale,
              },
            },
          },
        },
      },
    });
  });
