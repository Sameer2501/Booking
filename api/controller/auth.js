import User from '../models/users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const register=async(req,res,next)=>{
    try{
        const salt=bcrypt.genSaltSync(10);
        const hash=bcrypt.hashSync(req.body.password,salt);
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hash,

        })
        await newUser.save();
        res.status(201).send("user has been created");
    }
    catch(err){
        next(err);
    }
}
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isCorrect) {
      return res.status(400).send("Password is incorrect");
    }
    const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET,{expiresIn:"1d"});

    // ✅ success case
    res.cookie("access_cookie",token,{
      httpOnly:true
    }).status(200).send("Login successful");
 
  } catch (err) {
    next(err);
  }
};
