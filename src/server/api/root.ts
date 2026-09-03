import { articleRouter } from "~/server/api/routers/article";
import { memberRouter } from "~/server/api/routers/member";
import { settingsRouter } from "~/server/api/routers/settings";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  article: articleRouter,
  member: memberRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
