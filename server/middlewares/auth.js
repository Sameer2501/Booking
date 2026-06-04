import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';
//middleware to check if user is authenticated
const protect=async(req,res,next)=>{
    let token=req.headers.authorization && req.headers.authorization.startsWith('Bearer')?req.headers.authorization.split(' ')[1]:null;
    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select('-password');
            if(!req.user){
                return res.status(401).json({message:'User not found'})
            }
            next();
        } catch (error) {
            res.status(401).json({message:'Not authorized, token failed'})
        }
    }else{
        res.status(401).json({message:'Not authorized, no token'})
    }
}
const admin=(req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();
    }else{
        res.status(403).json({message:'Admin access required'})
    }

}
export {protect,admin};