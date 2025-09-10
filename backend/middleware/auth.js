import jwt from "jsonwebtoken";

export const protect= (req,res, next)=>{
    const authHeader = req.headers.authorization;
    console.log("🛡️ Incoming Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token =authHeader?.split(" ")[1];
    // if(!token) return res.status(401).json({message:"No token provided"});
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user= decoded;
        console.log("✅ Decoded JWT", decoded);
        next();
    }catch(err){
    console.error("❌ Invalid token:", err.message); 
    res.status(401).json({ message: "Invalid token", error: err.message });
   }
}