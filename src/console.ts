import { prisma } from "~/server/db";

const main = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();
    process.exit(1);
  });
