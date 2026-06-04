import express from 'express';
const router=express.Router();
import {bookEvent,sendBookingOTP,getBookings,confirmBooking,cancleBooking} from '../controllers/bookingController.js';
import {protect,admin} from '../middlewares/auth.js';
router.post('/',protect,bookEvent)
router.post('/send-otp',protect,sendBookingOTP)
router.get('/my',protect,getBookings);
//admin confirm krega islie admin middleware bhi add krna h
router.put('/:id',protect,admin,confirmBooking);
router.delete('/:id',protect,cancleBooking);
export default router;