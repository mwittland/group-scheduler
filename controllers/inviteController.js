import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//create methods for routes
export const sendInvite = async (req, res) => {
  try {
    const { cId, rId } = req.body;
    const cal = await prisma.calendar.findUnique({
      where: { id: cId },
    });
    const recipientUser = await prisma.user.findUnique({
      where: { id: rId },
    });
    if (!cal) res.status(404).json({ error: "Calendar does not exist" });
    if (!recipientUser) res.status(404).json({ error: "User does not exist" });
    const check = await prisma.invite.findFirst({
      where: { calendarId: cId, userId: rId },
    });
    if (check) res.status(404).json({ error: "Already invited this user" });
    const invite = await prisma.invite.create({
      data: {
        calendarId: parseInt(cId, 10),
        email: recipientUser.email,
        userId: parseInt(rId, 10),
        status: "pending",
      },
    });
    res.json(invite);
  } catch (err) {
    res.status(500).json({ message: "Server error when sending invite" });
  }
};

export const acceptInvite = async (req, res) => {
  //when you accept invite status is set to accepted and user is added to participant list in calendar
  try {
    const { inviteId } = req.body;
    const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) res.status(404).json("Invite not found");
    const updateInvites = await prisma.invite.update({
        where: {
            id: inviteId
        }, 
        data: {
            status: "accepted"
        }
    });
    const updateCalendars = await prisma.calendar.update({
        where: {
            id: invite.calendarId
        },
        data: {
            participants: {
                connect: { id: invite.userId },
            }
        },
        include: {
            participants: true, // This ensures participants are included in the returned data
        },
    })
    console.log(updateCalendars);
    res.json("Invite accepted");
  } catch (err) {
    res.status(500).json("Server error accepting invite");
  }
};

export const declineInvite = async (req, res) => {
  //when you decline invite the object gets deleted
  try {
    const { inviteId } = req.body;
    const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) res.status(404).json("Invite not found");
    const deleted = await prisma.invite.delete({ where: {id: inviteId }});
    res.json("Invite declined");
  } catch (err) {
    res.status(500).json("Server error accepting invite");
  }
};
