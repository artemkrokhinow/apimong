import Role from '../models/roleModels.js' 
import User from '../models/userModels.js'
import bcrypt from "bcryptjs";  
import jwt from "jsonwebtoken";  
import {secret} from "../config.js"


const generateAccessToken = (id, roles) =>{
    const payload = {
        id , roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

const RegistrController = {
    async registration(req ,res) {
        try {
            const {email , password} = req.body
            const NullUser = await User.findOne({email})
            if (NullUser){
                return res.status(400).json ({message: 'user is already registrated'  })
            } 
            let newRole = await Role.findOne({value: "USER"}) 
            if (!newRole){
                newRole = new Role({value: "USER"})
                await newRole.save()
                console.log(`new role create ${newRole}`)
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = new User({email , password:  hashPassword, roles: [newRole.value]})
            await user.save()
            return res.json({message: `пользователь ${user.email}`})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'registration error' })
        }
        
    },
    async login(req, res){
        try {
             const {email , password} = req.body
             const user = await User.findOne({email})
            if (!user){
                return res.status(400).json ({message: 'not registrated '  })
            }  
            const CheckPassword = bcrypt.compareSync(password, user.password)
            if (!CheckPassword){
                 return res.status(400).json ({message: 'not registrated '  })
            } const token = generateAccessToken(user._id, user.role)
            return res.json({token})
        }catch(e){
            res.status(400).json({message: 'login error' })
        }
      
    },
    async getUsers(req,res){
        try {
            let users = await User.find()
            return res.json(users)
        }catch(e){
            res.status(400).json({message: 'getUser error' })
        }
      
    },
    async getContacts(req,res){
        try{
            const currentUser = req.user.id
            const contacts = await User.find({_id: {$ne: currentUser}})
            res.json(contacts)
        }catch(e) {
            console.log(e)
            res.status(500).json({message : 'Error receiving contacts'})
        }
    }
}
export default RegistrController