//import mongoose library
import mongoose from "mongoose";

// Define the post schema using the Mongoose Schema constructor
const postSchema= new mongoose.Schema({
   title:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
   },
   status:{
    type:String,
    enum:['pending','in-progress','completed'],
    default:'pending',
   },
   created_by:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   
   //add timestamps for when the document is created and last modified 
},{timestamps:true});

// Export the Mongoose model for the post schema, using the name "Post"
export const Post=mongoose.model("Post",postSchema);

