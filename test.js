// Import the Prisma client
import { PrismaClient } from '@prisma/client';

// Instantiate the Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    // Create a new user record
    const newUser = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
      },
    });

    console.log('Created new user:', newUser);

    // Optionally, test retrieving the created user
    const fetchedUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' },
    });

    console.log('Fetched user:', fetchedUser);
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
}

// Run the main function
main();
