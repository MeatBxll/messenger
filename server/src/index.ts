import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

async function findUser(user: any) {
  const users = await prisma.user.findMany();
  const me = users.map((e: any) => {
    user === e ? e : null;
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
