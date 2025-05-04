import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCalendar = async (req, res) => {
  const { title, startDate, endDate, ownerId } = req.body;
  try {
    // Create the calendar in the database
    const newCalendar = await prisma.calendar.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ownerId: parseInt(ownerId, 10), // Ensure ownerId is an integer
      },
    });

    // Send the response with the new calendar
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
    const cal = await prisma.calendar.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!cal) return res.status(404).json({ error: "Calendar not found" });
    res.json(cal);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calendar" });
  }
};

export const deleteCalendarById = async (req, res) => {
  try {
    const deleted = await prisma.calendar.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete calendar" });
  }
}

export const getOwnedCalendars = async (req, res) => {
  try {
    const oId = parseInt(req.params.userId);
    const calendars = await prisma.calendar.findMany({
      where: {ownerId : oId}
    })
    if (!calendars) res.status(404).json({ error: "Calendars not found" });
    res.json(calendars);
  } catch (err) {
    res.status(500).json({ error: "Server error finding calendars"});
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
    if (!participatingCalendars) res.status(404).json({ error: "Calendars not found" });
    res.json(participatingCalendars);
  } catch (err) {
    res.status(500).json({ error: "Server error finding calendars"});
  }
}