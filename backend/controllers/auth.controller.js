import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup=async(req,res)=>{
    try{
        const { fullName, username, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

        //Checking user exist in our database
        const user=await User.findOne({username});//Checks if this user exist in our database or not.
        
        if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

        //If user does not exist we create a new user.
        //Hash Password here
        const salt = await bcrypt.genSalt(10);//Higher the value i.e. 10 is more,more will be our password secure 
        // but if you put 50 instead of 10 it will become slow as now more complex type hashed password will be created and thus take 
        // time in creation as well as comparision.
		const hashedPassword = await bcrypt.hash(password, salt);//password getting hashed with salt created in previous step.

        //Creating user with unique profile avator pic
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password:hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

        if(newUser){
            //Generating JWT tokens here for each user identity.
            generateTokenAndSetCookie(newUser._id, res);
             //Saving this user
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({ error: "Invalid user data" });
        }
       

    }catch(error){
        //For debugging 
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error in signup" });
    }
};


export const login=async (req,res)=>{
    try {
        //Getting values
		const { username, password } = req.body;
        //Finding the user in our database
        const user=await User.findOne({username});
        
        //Checkign if password is correct
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");//password from input and user.password from user.
        //user? because if username doesnot exist compare with empty stting.
        
        //If user or password does not match
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

        //Generating token and verifying where we are sending the payload and response.
		generateTokenAndSetCookie(user._id, res);

        //Once everything is fine we send the response .
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout=async(req,res)=>{
    try{
        res.cookie("jwt", "", { maxAge: 0 });//Cookie age This what means as soon as you logout your cookies gets destroyed.
		res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
        console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
};

