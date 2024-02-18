import Jwt from "jsonwebtoken";
import { errorHandler } from './error.js'

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401, 'Unauthorized Access'));
    }

    Jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>{
        if(err){
            return next(errorHandler(401, 'Access Not Verified'))
        }
        req.user = user;
        next();
    })
}