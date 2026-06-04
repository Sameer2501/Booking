import jwt from "jsonwebtoken";
export const verifyToken=(req,res,next)=>{
    const token=req.cookies.access_cookie;
    if(!token){
        return res.status(403).send("Acess denied");
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).send("Acess denied");
        }
        else{
            req.user=user;
            next();
        }
    })
}
export const verifyUser=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).send("Acess denied");
        }
        //the work of this function is to check if the user is logged in and if the user is the owner of the account and 
    })
}
export const verifyAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).send("Acess denied");
        }
        //the work of this function is to check if the user is logged in and if the user is the owner of the account and 
    })
}