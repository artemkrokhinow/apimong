import { useState, useEffect } from 'react';
import api from '../services/api.js';
import socket from '../services/socket.js';
export function useChat(token, selectedUser, currentUserId){
 const [messages , setMessages] = useState([])
 const [error, setError] = useState('');
useEffect(()=>{
        if(!selectedUser){
            setMessages([])
            return
        }
        const fetchMessage = async ()=>{
            try{
                setError('')
                const data = await api.getMessages(selectedUser._id)
                setMessages(data)
            }catch(err){
                setError(err.message)
            }
       } 
  
     const messageListener = function(newMessage){
        if(newMessage.senderId === selectedUser._id){
            setMessages(prev=>[...prev, newMessage])
        }
    };  fetchMessage()
        socket.on('getMessage', messageListener)
        return ()=>{
            socket.off('getMessage', messageListener)
        }
},[selectedUser, token])
    const sendMessage = (text) =>{
        if(!text.trim() || !selectedUser)return
        const messageData = {
            senderId: currentUserId,
            receiverId: selectedUser._id,
            text: text
        }
        socket.emit('sendMessage', messageData)
        setMessages(prev =>[...prev, {...messageData, _id: Date.now().toString()}])

    }
    return{messages , error, sendMessage}
}
