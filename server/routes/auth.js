import express from 'express'
const router=express.Router();
import {registerUser,loginUser,verifyOtp} from '../controllers/authController.js'
router.post('/register',registerUser);
router.post('/login',loginUser);
router.route('/verify-otp')
    .post(verifyOtp)
    .all((req, res) => {
        res.status(405).json({ message: `Method ${req.method} not allowed on /api/auth/verify-otp. Please use POST.` });
    });
export default router;