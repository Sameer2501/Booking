import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnect from './config/dbConfig.js'
import authRoutes from './routes/auth.js'
import eventRoutes from './routes/events.js'
import bookingRoutes from './routes/bookings.js'
dotenv.config();
 const app=express();
dbConnect();
app.use(cors());
app.use(express.json());
//routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);
 const port=process.env.PORT
 app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 })