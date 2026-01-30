import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const VerifyJWT=(req,res,next)=>{
    try {
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"Unauthorized. No token Provided"});
        };
        const token=authHeader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user={
            id:decoded.id
        };
        next();
    } catch (error) {
    console.log("JWT Error Name:", error.name);
    console.log("JWT Error Message:", error.message);
    return res.status(401).json({ message: error.message });
}
}