import {secret} from '../config.js';
import jwt from "jsonwebtoken"; 

export default function (req, res , next) {
    if (req.method === 'OPTIONS'){
        return next()
    }
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(403).json({message:"user not autorizated (token fail)"})
        }
        const decodedDate = jwt.verify(token, secret)
    req.user = decodedDate
    next()
    
} catch (e){
    console.log(e)
    return res.status(403).json({message: "user not autorizated (token fail)"})
} 
}
