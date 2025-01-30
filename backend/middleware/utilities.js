import jwt from "jsonwebtoken"

export const AuthenticateToken = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //No token, authorized
    if(!token) return res.status(401).json({ message:"Authorization token not found"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        //Token invalid, forbidden
        if(err) return res.status(401).json({ message:"Authorization token is invalid"});
        req.user=user;
        next();
    })
}

//export default AuthenticateToken;