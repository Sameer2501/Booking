import express from 'express';

import { createHotel,updateHotel,deleteHotel,getHotel,getHotels} from '../controller/hotels.js';
const router=express.Router();
//create hotel
router.post("/",createHotel)
//update hotel
router.put("/:id",updateHotel)
//delete hotel
router.delete("/:id",deleteHotel)
//get hotel
router.get("/:id",getHotel)
//get all hotel
router.get("/",getHotels)
export default router;