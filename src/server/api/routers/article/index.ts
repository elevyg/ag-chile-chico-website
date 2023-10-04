import { z } from "zod";
import { getAll } from "~/server/api/routers/article/getAllArticles";
import { getArticle } from "~/server/api/routers/article/getArticle";
import { getArticlesPreview } from "~/server/api/routers/article/getArticlesPreview";
import { softDeleteArticle } from "~/server/api/routers/article/softDeleteArticle";
import { upsertArticle } from "~/server/api/routers/article/upsertArticle";

import { createTRPCRouter } from "~/server/api/trpc";

export const articleRouter = createTRPCRouter({
  get: getArticle,
  getAll: getAll,
  getPreviews: getArticlesPreview,
  upsert: upsertArticle,
  softDelete: softDeleteArticle,
});
