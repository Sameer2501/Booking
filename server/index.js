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
const allowedOrigins = [
  'https://booking-zeta-red.vercel.app',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
//routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);
 const port=process.env.PORT
 app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 })