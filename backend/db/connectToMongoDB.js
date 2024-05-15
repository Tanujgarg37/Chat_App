import mongoose from "mongoose";

const connectToMongoDB=async()=>{
    try{
            await mongoose.connect(process.env.MONGO_URL);
            console.log("COnnected to mongoDB successfully");
    }
    catch(error){
            console.log("Error connecting to mongoDB database",error.message);
    }
};

export default connectToMongoDB;