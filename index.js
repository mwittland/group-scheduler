import express from "express";
import passport from "passport";
import userRoutes from "./routes/userRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "./middleware/passport.js";
import cors from "cors";

const app = express();

app.use(express.json());

// CORS config to allow frontend requests and token headers
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3001",
    credentials: true, // no need for cookies now
  })
);

// Initialize Passport (no session needed)
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/calendars", calendarRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/availability", availabilityRoutes);

app.listen(3000, () => {
  console.log("server running on port 3000");
});
