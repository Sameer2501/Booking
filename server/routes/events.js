import express from 'express';
const router=express.Router();
import {protect,admin} from '../middlewares/auth.js';
import {getAllEvents,getEventById,createEvent,updateEvent,deleteEvent} from '../controllers/eventController.js';
//get all bookings
router.get('/',getAllEvents);
//get booking by id
router.get('/:id',getEventById);
//create booking
router.post('/',protect,admin,createEvent);
//update booking
router.put('/:id',protect,admin,updateEvent);
//delete booking
router.delete('/:id',protect,admin,deleteEvent);
export default router;