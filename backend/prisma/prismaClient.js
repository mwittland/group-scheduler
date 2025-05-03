// backend/prisma/prismaClient.js
import { PrismaClient } from '../generated/prisma/index.js'; // Path to the generated client

const prisma = new PrismaClient();

export default prisma;
