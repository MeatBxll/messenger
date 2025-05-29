import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

async function CheckUserNameAndPassword(e: string) {
  const users = await prisma.user.findUnique();
  console.log(users);
}
