import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email } = req.body;
    const newUser = await prisma.user.create({
      data: { username, email }
    });
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create user'});
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};
