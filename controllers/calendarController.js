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
    const user = await prisma.calendar.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!user) return res.status(404).json({ error: "Calendar not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calendar" });
  }
};
