import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const ssgApiHelper = async () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(),
    transformer: SuperJSON,
  });
