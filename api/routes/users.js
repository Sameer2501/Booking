import express from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controller/users.js';
import {verifyAdmin, verifyToken, verifyUser} from '../utils/verifyToken.js'
const router=express.Router();
router.get("/checkAuth",verifyToken,(req,res,next)=>{
    res.send("hello auth")
})
router.get("/checkuser/:id",verifyUser,(req,res,next)=>{
    res.send(" hello user ,you are logged in and you can delete your account")
})
router.get("/checkAdmin/:id",verifyAdmin,(req,res,next)=>{
    res.send("hello admin")
})

router.put("/:id",updateUser)
//delete hotel
router.delete("/:id",deleteUser)
//get hotel
router.get("/:id",getUser)
//get all hotel
router.get("/",getUsers)
export default router;