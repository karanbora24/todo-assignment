import ErrorHandler from "../middleware/error.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

//signup controller for register user
export const register = async (req, res,next) => {
  try {
    //destructure fields from request body
    const { userName, email, password } = req.body;

    //check if all details are there or not
    if (!userName || !email || !password)
      return next(new ErrorHandler("All Fields are required", 403));

    //check if user is already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new ErrorHandler("user already exists", 400));

    //hashed the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create the user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      sucess: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

//Login controller for authenticating users
export const login = async (req, res,next) => {
  try {
    //get email and password from request body
    const { email, password } = req.body;

    //check if email or password is missing
    if(!email||!password) return next(new ErrorHandler("please fill up all the required fields",400));

    //find user with provided email
    const user=await User.findOne({email});

    //if user not found with provided email
    if(!user) return next(new ErrorHandler("user is not registered with us, please signup to continue",401));

    //generate jwt token with compare password
    if(await bcrypt.compare(password,user.password))
    {
        const token=jwt.sign({email:user.email,id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'24h'});

      //   user = {
      //     _id: user._id,
      //     userName: user.userName,
      //     email: user.email,
      //    // post:
      // }

        //set cookie for token and return success response
        const options ={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        return res.cookie("token",token, options).json({
            success:true,
            token,
            user,
            message:"user login successful",
        })
        }else{
        return next(new ErrorHandler("password is incorrect",401));
    }


  } catch (error) {
    next(error);
  }
};
