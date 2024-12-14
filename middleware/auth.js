import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

//this function is used as middleware for authenticate users requests
export const auth = async (req, res, next) => {
  try {
    //extracting jwt from request cookies,header or body
    const token = req.cookies.token||req.body.token ||req.header("Authorization").replace("Bearer ", "");

    //if Jwt is missing
    if(!token) return next(new ErrorHandler("token missing",401));

    try {
        //verify jwt using the secret key
        const decode =await jwt.verify(token,process.env.JWT_SECRET_KEY);
        
        //storing decoded jwt payload in a request body for further use
        req.user=decode;

    } catch (error) {
        //if jwt verification is failed
        return next(new ErrorHandler("token is invalid",401));
    }

    //if jwt is valid, move on next middleware or request handler
    next();
  } catch (error) {
    next(error);
  }
};
