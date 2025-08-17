import express from 'express'
import mongoose from 'mongoose'
import router from "./post/routerPost.js"
import cors from 'cors'
import routerMessage from "./Message/routerMessage.js"
import rrouter from "./Routes/routerRegistr.js"
import { Server } from 'socket.io'
import {createServer} from 'http'
import MessageService from './Message/MessageService.js'
import 'dotenv/config';

const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {origin:"http://localhost:3000"}
})

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use('/api', rrouter)
app.use('/api', routerMessage)

let onlineUsers = new Map()
io.on('connection', (socket)=>{
   
    socket.on('addUser', (userId)=>{
        let userSockets = onlineUsers.get(userId) || [];
        userSockets.push(socket.id)
       onlineUsers.set(userId, userSockets)
        console.log(`+ User ${userId} added. Online users now:`, onlineUsers);
    })
    socket.on('sendMessage',async ({senderId, receiverId, text}) =>{
          console.log(`\n--- Attempting to send message ---`);
            console.log(`From: ${senderId} -> To: ${receiverId}`);
            console.log('Current online users:', onlineUsers);
        const receiverSocketId = onlineUsers.get(receiverId)
        if(receiverSocketId && receiverSocketId.length > 0 ){
            const newMessage = await MessageService.create(senderId, receiverId , text)
            console.log(`message from ${senderId} to ${receiverId}`)
       receiverSocketId.forEach(socketId =>{
        io.to(socketId).emit('getMessage', newMessage)
       })
        } else {
            console.log(`receiver ${receiverId} is offline `)
        }
    })
    console.log('io connect ')
    socket.on('disconnect', ()=>{
        let disconnectedUserId;
        for (const [userId, sockets] of onlineUsers.entries()) {
           
            if (sockets.includes(socket.id)){
            disconnectedUserId = userId
            break;}
            } if (disconnectedUserId){
                const remainingSockets = onlineUsers.get(disconnectedUserId).filter(s => s !== socket.id)
                if(remainingSockets.length > 0){
                    onlineUsers.set(disconnectedUserId, remainingSockets)
                } else onlineUsers.delete(disconnectedUserId)
            
                
            }
           
             console.log(`User disconnected with socket ID: ${socket.id}. Online users now:`, onlineUsers);
    })
})

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        server.listen(PORT, ()=> console.log('SERVER STARTED ON PORT ' + PORT ))
    } catch (e){
        console.log(e)
    }
}
startApp()