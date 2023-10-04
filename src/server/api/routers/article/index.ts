import { z } from "zod";
import { getAll } from "~/server/api/routers/article/getAll";
import { getArticle } from "~/server/api/routers/article/getArticle";
import { upsertArticle } from "~/server/api/routers/article/upsertArticle";

import { createTRPCRouter } from "~/server/api/trpc";

export const articleRouter = createTRPCRouter({
  get: getArticle,
  getAll: getAll,
  upsert: upsertArticle,
});
