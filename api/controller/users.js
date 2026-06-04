import User from '../models/users.js'

export const updateUser=async(req,res,next)=>{
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        return res.status(200).json(updatedUser)
    }
    catch(err){
        next(err);
    }
}

export const deleteUser=async(req,res,next)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            message:"data has been deleted",
        })
    }
    catch(err){
       next(err);
    }
}
export const getUser=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id);
        res.status(200).json(user)
    }
    catch(err){
       next(err);
    }
}
export const getUsers=async(req,res,next)=>{
    try{
        const user=await User.find();
        res.status(200).json(user)
    }
    
    catch(err){
       next(err);
    }
}