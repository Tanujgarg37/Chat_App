import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

const protectRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;//getting token from cookies . But before this we need to use cookieParser config in server file.
        //If token is not there
        if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

        //Decode that token 
		const decoded = jwt.verify(token, process.env.JWT_SECRET);//JWT secret was used to sign the document and 
        //now we will use this to verify/decode the token. 

        //Return when decoded value is false
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

        const user = await User.findById(decoded.userId).select("-password");//Getting the id and removing the password.
       
        if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
        //Now in req we have user which is in our database.
		req.user = user;

		next();//will call the next function which is sendMessage.  
    }
    catch(error){
        console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;