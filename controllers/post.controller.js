import ErrorHandler from "../middleware/error.js";
import { Post } from "../models/Post.model.js";
import { User } from "../models/User.model.js";

// Function to create a new course
export const createPost = async (req, res, next) => {
  try {
    //get user id from request object
    const userId = req.user.id;

    // get all required fields from request body
    let { title, description, status } = req.body;

    //check if any of the required fields are missing
    if (!title || !description)
      return next(new ErrorHandler("all fields are mandatory", 400));

    //create a new course
    const newPost = await Post.create({
      title,
      description,
      status,
      created_by: userId,
    });

    //add new post to the user Schema
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          posts: newPost._id,
        },
      },
      { new: true }
    );

    // return the new post and a success message
    return res.status(200).json({
      success: true,
      newPost,
      message: "Course created successfully",
    });
  } catch (error) {
    next(error);
  }
};

//function to fetch all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find(
      { status: 'completed' },
      { title: true, description: true, created_by: true }
    ).sort({ createdAt:-1})
      .populate({path:'created_by',select:'userName'})
      .exec();

    // return response  
    return res.status(200).json({
        success: true,
        posts,
        message:'all posts fetched successfully'
    });

  } catch (error) {
    next(error);
  }
};

//Fetch a task by its ID.
export const getPostById=async(req,res,next) => {
    try {
        // get post id from request pa
        const postId=req.params.id;
        const post=await Post.findById(postId).populate({path:'created_by',select:'userName'});

        //check post is valid or not
        if(!post) return next(new ErrorHandler("post not found",404));

        return res.status(200).json({
            success: true,
            post,
            message:'Post was successfully fetched'
        });



    } catch (error) {
        next(error);
    }
};


//update post
export const updatePost =async(req, res, next)=>{
    try {
        const postId = req.params.id;
        let {title,description,status} = req.body;

        if(status==="completed"){
            status = 'completed';
        }else if(status===undefined){
            status='in-progress';
        }else{
            status = 'pending';
        }

        const updated={title,description,status};

        const post = await Post.findById(postId);
        //check postId is valid or not
        if(!post) return next(new ErrorHandler("post not found",403));

        //update post in post schema
        const updatedPost=await Post.findByIdAndUpdate(post,updated,{new:true});

        if(!updatedPost) return next(new ErrorHandler("post not updated",403));

        return res.status(200).json({
            success:true,
            message:"Post updated successfully"
        })

    } catch (error) {
        next(error);
    }
};

// function to delete post
export const deletePost=async(req,res,next)=>{
    try {
        const postId=req.params.id;
        const userId=req.user.id;

        //check postId is valid or not
        const post=await Post.findById(postId);
        if(!post) return next(new ErrorHandler("post not found",402));

        // remove the post id from the user's post
        // let user = await User.findById(userId);
        // user.posts = user.posts.filter(id => id.toString() !== postId);
        // await user.save();

        await User.updateOne({_id:userId}, {$pull:{posts:postId}},{new:true});
        
        //delete post
        await Post.findByIdAndDelete(post);
        //return response
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};