import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const sendInvite = async (req, res) => {
  try {
    const { cId, rId } = req.body;
    const cal = await prisma.calendar.findUnique({
      where: { id: cId },
    });
    const recipientUser = await prisma.user.findUnique({
      where: { id: rId },
    });
    if (!cal) return res.status(404).json({ error: "Calendar does not exist" });
    if (!recipientUser)
      return res.status(404).json({ error: "User does not exist" });
    const check = await prisma.invite.findFirst({
      where: { calendarId: cId, userId: rId },
    });
    if (check)
      return res.status(404).json({ error: "Already invited this user" });
    const invite = await prisma.invite.create({
      data: {
        calendarId: parseInt(cId, 10),
        email: recipientUser.email,
        userId: parseInt(rId, 10),
        status: "pending",
      },
    });
    return res.json(invite);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error when sending invite" });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.body;
    const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) return res.status(404).json("Invite not found");
    const updateCalendars = await prisma.calendar.update({
      where: {
        id: invite.calendarId,
      },
      data: {
        participants: {
          connect: { id: invite.userId },
        },
      },
      include: {
        participants: true, 
      },
    });
    await prisma.invite.delete({ where: { id: inviteId } });
    console.log(updateCalendars);
    return res.json("Invite accepted");
  } catch (err) {
    return res.status(500).json("Server error accepting invite");
  }
};

export const declineInvite = async (req, res) => {
  try {
    const { inviteId } = req.body;
    const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) return res.status(404).json("Invite not found");
    await prisma.invite.delete({ where: { id: inviteId } });
    return res.json("Invite declined");
  } catch (err) {
    return res.status(500).json("Server error accepting invite");
  }
};

export const viewInvites = async (req, res) => {
  try {
    const uId = parseInt(req.params.id);
    const invites = await prisma.invite.findMany({
      where: { userId: uId },
      include: {
        calendar: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!invites) res.status(404).json({ error: "Invites not found" });
    return res.json(invites);
  } catch (err) {
    return res.status(500).json("Server error getting invites");
  }
};
