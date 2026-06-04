import mongoose from "mongoose";
const conection=async()=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("db connected")
    }
    catch(error){
        console.log(error)
    }
}
export default conection;