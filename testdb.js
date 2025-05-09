import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Connected successfully:', result);
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

main();