import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAvailability = async (req, res) => {
  try {
    const { calendarId, userId, availableDates } = req.body;
    const calendar = await prisma.calendar.findUnique({
      where: { id: calendarId },
    });
    if (!calendar)
      return res.status(404).json({ error: "Calendar does not exist " });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User does not exist" });
    const isParticipant = await prisma.calendar.findFirst({
      where: {
        id: calendarId,
        OR: [{ ownerId: userId }, { participants: { some: { id: userId } } }],
      },
    });
    if (!isParticipant) {
      return res
        .status(403)
        .json({ error: "User not authorized for this calendar" });
    }

    await prisma.availability.deleteMany({
        where: { userId, calendarId }
    });

    const startDate = new Date(calendar.startDate);
    const endDate = new Date(calendar.endDate);

    const validDates = availableDates.filter((dateStr) => {
      const d = new Date(dateStr);
      return d >= startDate && d <= endDate;
    });

    const availabilityData = validDates.map((dateStr) => ({
      calendarId,
      userId,
      date: new Date(dateStr),
    }));

    const created = await prisma.availability.createMany({
      data: availabilityData,
      skipDuplicates: true,
    });

    return res
      .status(201)
      .json({ message: "Availability created", count: created.count });
  } catch (err) {
    res.status(500).json({ error: "Server error creating availability" });
  }
};

export const getAvailabilityByCalendarId = async (req, res) => {
    try {
        const calendar = await prisma.calendar.findUnique({where: {id: parseInt(req.params.id)}});
        if (!calendar) return res.status(404).json({error:"Calendar not found"});
        const availability = await prisma.availability.findMany({
            where: { calendarId: calendar.id },
        });
        return res.json(availability);
    } catch (err) {
        return res.status(500).json({ error: "Server finding availability" });
    }
}