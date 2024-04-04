import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './db/connectToMongodb.js';

import authRoute from './routes/auth.routes.js';
// import messageRoute from './routes/message.routes.js';
// import ConversationRoute from './routes/conversation.routes.js';

import messageRoute from './routes/message.routes.js';
import userRoute from './routes/user.routes.js';

const app=express();
dotenv.config();
const PORT=process.env.PORT||4800;

//Middlewares

app.use(cookieParser());//calling this will allow to access cookies.
//This allows you to accept json format.
app.use(express.json());//Parse incoming request with JSON payloads(from req.body)

app.use("/api/auth",authRoute);
app.use("/api/message",messageRoute);
app.use("/api/user",userRoute);


// app.get("/",(req,res)=>{
//     //Root route 
//     res.send("Serber is ready");
// });

app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server started on port ${PORT}`)
});