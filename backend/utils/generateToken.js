import jwt from "jsonwebtoken";

const generateTokenAndSetCookie=(userId,res)=>{
    //Creating token
    //jwt.sign takes some payload and embeds below information i.e. in this case userId into jwt token.JWT_Secret 
    //will be the key to sign the token and create a digital signature and 
    //when we want to verify this token we will use payload as {userId}
    
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

    //setting this token in our cookie
    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS (15days ) age of cookie
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks//means this cookie can be used only by http not by JS
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
    })
}

export default generateTokenAndSetCookie;