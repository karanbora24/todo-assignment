//import mongoose library
import mongoose from "mongoose";

// Define the user schema using the Mongoose Schema constructor
const userSchema= new mongoose.Schema({
   userName:{
    type:String,
    required:true,
    trim:true,
   },
   email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
   },
   password:{
    type:String,
    required:true,
   },
   posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
   }]
   //add timestamps for when the document is created and last modified 
},{timestamps:true});

// Export the Mongoose model for the user schema, using the name "User"
export const User=mongoose.model("User",userSchema);

