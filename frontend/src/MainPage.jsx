import React, {useState, useEffect   } from 'react'; 
import './App.css'  
import Header from './Header.jsx'
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';

const socket = io('http://localhost:5000')

function  MainPage ({token, setToken}){
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [selectedUser , setSelectedUser] = useState(null);
    const [messages , setMessages] = useState([])
    const [newMessageText, setNewMessageText] = useState('')
    const decodedToken = jwtDecode(token)
    const currentUser = decodedToken.id 
    useEffect(()=>{
        const fetchUsers = async ()=>{               ////Effect for loading users and connecting to socket (runs once)
            setError('')
            try{
                    const response = await fetch (`http://localhost:5000/api/contacts`,
                        {method: 'GET',
                        headers: {'Authorization': `Bearer ${token}`}
                        }
                    )
                    const data = await response.json()
                    console.log(data)
                    if (!response.ok) {
                        throw new Error(data.message)
                    } setUsers(data.filter(users => users._id !== currentUser))
                    console.log(users)
                } catch (err){
                    console.error(err)
                    setError(err.message)
                }
        };  
        if (token){
            fetchUsers()
             const decodedToken=jwtDecode(token)
        socket.emit('addUser' , decodedToken.id)   
    }
        
    },[token, currentUser])
    useEffect(()=>{                                  ////Effect for loading message history (triggered when owner changes)
        const fetchMessage = async ()=>{
              console.log('Fetching messages for user:', selectedUser?._id);
            if(!selectedUser)return ;
            setMessages([]) 
            try {
                const response = await fetch (`http://localhost:5000/api/chat/${selectedUser._id}`,
                    {
                        method : 'GET',
                        headers : {'Authorization' : `bearer ${token}`},
                        cache : 'no-cache'
                    }
                ) 
                const data = await response.json()
                
                if (!response.ok){
                    throw new Error(data.message)
                } setMessages(data)
            } catch (err){
                console.error(err)
                setError(err.message)
            }
        }
        fetchMessage()
        const messageListener = (newMessage)=>{    /////messageListener
        if (selectedUser &&  newMessage.senderId === selectedUser._id){
             console.log('MESSAGE RECEIVED BY SOCKET:', newMessage);
            setMessages(prevMessages=>[...prevMessages, newMessage])
        }
    }              
            socket.on('getMessage', messageListener)
            return ()=>{
                socket.off('getMessage', messageListener)
            }
    }, [selectedUser, token])
    const handleLogout = ()=>{                                    /////LOGOUT 
        localStorage.removeItem('token')
        setToken(null)
    }
    const handleSendMessage =(event)=>{                       /////handleSendMessage
        event.preventDefault();
        if(newMessageText.trim() && selectedUser){
            const senderId = currentUser
            const messageData = {
                senderId : senderId,
                receiverId : selectedUser._id,
                text : newMessageText
            }
            const optimisticMessage = {...messageData, _id: Date.now().toString()}
            socket.emit('sendMessage', messageData)
            setMessages( prevMessages =>[...prevMessages, optimisticMessage ])
            setNewMessageText('');
        }
    }
   
return (
         <div className="app-container">
            <Header />
               <div className="main-layout">
                  <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Пользователи</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="user-list">
                        {users.map(user => (
                            <li key={user._id}>
                                <button className="user-button" onClick={() => setSelectedUser(user)}>
                                    {user.email || user.username}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className="logout-button" onClick={handleLogout} style={{ marginTop: 'auto' }}>Выйти</button>
                 
                </div>
                </aside>
                <main className="chat-area">
                     
                    {selectedUser ? (
                       <>
                    <div className="chat-header">
                            <h2>Чат с {selectedUser?.email}</h2>
                            </div>
                            <div className = 'message-list'>
                                {messages.map( msg => (
                                    <div
                                        key = {msg._id }
                                        className = {msg.senderId === currentUser ? 'message-sent' : 'message-recived'}>
                                            <p style={{margin: 0 }}>{msg.text}</p>
                                </div>
                                 ))}
                    </div>
                    
                        <form  className="message-form" onSubmit={handleSendMessage}>
                            <input   
                            className="message-input" 
                            value = {newMessageText} 
                            placeholder='write a message' 
                            onChange={(event)=>setNewMessageText(event.target.value)} 
                            />
                            <button  className="send-button" type = 'submit'></button>
                         </form>
                      </>
                    ) : (
                        <div className="no-chat-selected">
                        <p>Выберите собеседника, чтобы начать чат</p>
                        </div>
                    )}
                    
                 </main>
            </div>
          
        </div>
        
    );
}
export default MainPage