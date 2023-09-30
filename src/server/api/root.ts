import { z } from "zod";
import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  getArticle: publicProcedure
    .input(z.object({ slug: z.string(), locale: z.string() }))
    .query(async ({ ctx, input }) => {
      const { content, id, slug, title, updatedAt, description } =
        await ctx.prisma.article.findUniqueOrThrow({
          where: { slug: input.slug },
          include: {
            title: true,
            content: { include: { originalLang: true } },
          },
        });

      if (content.originalLang.languageId !== input.locale) {
        const translatedContent = await ctx.prisma.translation.findFirstOrThrow(
          {
            where: {
              textContent: { id: content.id },
              languageId: input.locale,
            },
          },
        );

        const translatedTitle = await ctx.prisma.translation.findFirstOrThrow({
          where: {
            textContent: { id: title.id },
            languageId: input.locale,
          },
        });

        return {
          title: translatedTitle.translation,
          content: translatedContent.translation,
          id,
          slug,
          updatedAt,
          description,
        };
      }

      return {
        title: title.originalText,
        content: content.originalText,
        id,
        slug,
        updatedAt,
        description,
      };
    }),
});

export type AppRouter = typeof appRouter;
