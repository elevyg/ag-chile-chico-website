import { z } from "zod";
import { getArticle } from "~/server/api/routers/article/getArticle";
import { upsertArticle } from "~/server/api/routers/article/upsertArticle";

import { createTRPCRouter } from "~/server/api/trpc";

export const articleRouter = createTRPCRouter({
  get: getArticle,
  upsert: upsertArticle,
});
