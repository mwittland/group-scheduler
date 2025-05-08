import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCalendar = async (req, res) => {
  const { title, startDate, endDate, ownerId } = req.body;
  try {
    const newCalendar = await prisma.calendar.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ownerId: parseInt(ownerId, 10),
      },
    });
    return res.status(201).json({
      message: "Calendar created successfully!",
      calendar: newCalendar,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create calendar" });
  }
};

export const getCalendarById = async (req, res) => {
  try {
    const userId = req.user.id;
    const calendarId = parseInt(req.params.id);
  
    const calendar = await prisma.calendar.findUnique({
      where: { id: calendarId },
      include: {
        participants: true,
        owner: true,
      },
    });
  
    if (
      calendar.ownerId !== userId &&
      !calendar.participants.some((user) => user.id === userId)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }
  
    return res.json(calendar);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch calendar" });
  }
};

export const deleteCalendarById = async (req, res) => {
  try {
    const deleted = await prisma.calendar.delete({
      where: { id: parseInt(req.params.id) }
    })
    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete calendar" });
  }
}

export const getOwnedCalendars = async (req, res) => {
  try {
    const oId = parseInt(req.params.userId);
    const calendars = await prisma.calendar.findMany({
      where: {ownerId : oId}
    })
    if (!calendars) res.status(404).json({ error: "Calendars not found" });
    return res.json(calendars);
  } catch (err) {
    return res.status(500).json({ error: "Server error finding calendars"});
  }
}

export const getParticipantCalendars = async (req, res) => {
  try {
    const uId = parseInt(req.params.userId);
    const participatingCalendars = await prisma.calendar.findMany({
      where: {
        participants: {
          some: {
            id: uId,
          },
        },
      },
    });
    if (!participatingCalendars) return res.status(404).json({ error: "Calendars not found" });
    return res.json(participatingCalendars);
  } catch (err) {
    return res.status(500).json({ error: "Server error finding calendars"});
  }
}