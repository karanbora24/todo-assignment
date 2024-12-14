import express from 'express';
import dotenv, { config } from "dotenv";
import Connect from './config/database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ErrorMiddleware } from './middleware/error.js';
import userRouter from './routes/user.route.js'
import postRoute from './routes/post.route.js';
const app = express();

// loading environment variables from .env file
dotenv.config();

// setting up port number
const port=process.env.PORT ||8000; 

// connected to database
//database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'*',
    credentials:true,
}));

// using error middleware
app.use(ErrorMiddleware);
// setting up routes
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/post', postRoute);

//testing the server
app.get('/',(req,res)=>{
    return res.json({
        success:true,
        messsage:"Your server is up and running...",
    });
});

//Listening to the server
app.listen(port,()=>{           
    Connect();  
    console.log(`App listening on ${port}`);
});

//end of code 