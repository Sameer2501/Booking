import Hotel from '../models/hotels.js'
export const createHotel=async(req,res,next)=>{
    try{
         const newHotel=new Hotel(req.body);
        const savedHotel=await newHotel.save();
        return res.status(200).json({
            message:"success",
            data:savedHotel
        })
    }
    catch(err){
       next(err);
    }
}
export const updateHotel=async(req,res,next)=>{
    try{
        const updatedHotel=await Hotel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        return res.status(200).json(updatedHotel)
    }
    catch(err){
        next(err);
    }
}
export const deleteHotel=async(req,res,next)=>{
    try{
        await Hotel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            message:"data has been deleted",
        })
    }
    catch(err){
       next(err);
    }
}
export const getHotel=async(req,res,next)=>{
    try{
        const hotel=await Hotel.findById(req.params.id);
        res.status(200).json(hotel)
    }
    catch(err){
       next(err);
    }
}
export const getHotels=async(req,res,next)=>{
    try{
        const hotels=await Hotel.find();
        res.status(200).json(hotels)
    }
    
    catch(err){
       next(err);
    }
}