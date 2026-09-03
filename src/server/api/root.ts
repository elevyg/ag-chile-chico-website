import { articleRouter } from "~/server/api/routers/article";
import { memberRouter } from "~/server/api/routers/member";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  article: articleRouter,
  member: memberRouter,
});

export type AppRouter = typeof appRouter;
