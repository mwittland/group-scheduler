import express from 'express';
import userRoutes from './routes/userRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/calendars', calendarRoutes);
app.listen(3000, () => {
    console.log("server running on port 3000");
})