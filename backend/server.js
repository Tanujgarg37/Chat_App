import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoute from './routes/auth.routes.js';
import messageRoute from './routes/message.routes.js';
import userRoute from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongodb.js';
import {app,server} from './socket/socket.js';

const PORT=process.env.PORT||8800;

const __dirname = path.resolve();

dotenv.config();

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
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


server.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server started on port ${PORT}`)
});