import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const main = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await db.$disconnect();
    process.exit(1);
  });
