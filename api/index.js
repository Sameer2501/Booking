import express from 'express';
import dotenv from 'dotenv';
import connection from './config/dbConfig.js';

import authRoutes from './routes/auth.js';
import hotelsRoutes from './routes/hotels.js';
import roomsRoutes from './routes/rooms.js';
import usersRoutes from './routes/users.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelsRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/users", usersRoutes);

// CONNECT DB THEN START SERVER
connection().then(() => {
   

  app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
  });
});
