import { z } from "zod";
import { getArticle } from "~/server/api/procedures/getArticle";
import { upsertArticle } from "~/server/api/procedures/upsertArticle";

import { createTRPCRouter } from "~/server/api/trpc";

export const articleRouter = createTRPCRouter({
  get: getArticle,
  upsert: upsertArticle,
});
