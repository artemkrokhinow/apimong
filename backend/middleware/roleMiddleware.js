import {secret} from '../config.js';
import jwt from "jsonwebtoken";

export default function (allowedRoles) {
    return function (req, res , next){
    if (req.method === 'OPTIONS'){
        return next()
    }
    try{ // НАЧАЛО БЛОКА TRY
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(403).json({message: "not autorizated"})
        }
        const decodedPayLoad = jwt.verify(token, secret)
        const userRolesFromToken = decodedPayLoad.roles

        if(!userRolesFromToken || !Array.isArray(userRolesFromToken)){
            console.error('error: roles - empty or not an array', decodedPayLoad)
            return res.status(403).json({message: "fail format token "})
        }

        let userHasRequiredRole = false 
        userRolesFromToken.forEach(currentUserRole =>{
            if(allowedRoles.includes(currentUserRole))
            {
                userHasRequiredRole = true 
            }
        });

        if (userHasRequiredRole){ 
            next()
        } else {
            return res.status(403).json({
                message: 'not access'
            })
        }
    } catch(e){  
        console.log(e)
        if(e.name === 'TokenExpiredError'){
            return res.status(401).json({
                message: 'user not access (token expired)'
            })
        }
        if(e.name === 'JsonWebTokenError'){
            return res.status(401).json({message: 'not valid token'})
        }
        return res.status(403).json({message: 'not access (fail token)'}) 
    } 
}}