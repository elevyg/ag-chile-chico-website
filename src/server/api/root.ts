import { articleRouter } from "~/server/api/routers/article";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  article: articleRouter,
});

export type AppRouter = typeof appRouter;
