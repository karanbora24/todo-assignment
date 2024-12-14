import mongoose from "mongoose";
 const Connect=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connection success');
    } catch (error) {
        console.log('DB connection error');
        console.log(err);
        process.exit(1);   
    }
    
}
export default Connect;