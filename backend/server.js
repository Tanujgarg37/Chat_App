import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import {app,server} from './socket/socket.js';

dotenv.config();

const __dirname = path.resolve();

const PORT=process.env.PORT||5000;

//Middlewares

//This allows you to accept json format.
app.use(express.json());//Parse incoming request with JSON payloads(from req.body)


app.use(cookieParser());//calling this will allow to access cookies.

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);


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