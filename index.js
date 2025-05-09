import express from "express";
import session from "express-session";
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
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3001",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET, // store securely in env in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/calendars", calendarRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/availability", availabilityRoutes);
app.listen(3000, () => {
  console.log("server running on port 3000");
});
