import React, {useState, useEffect   } from 'react'; 
import './App.css'  
import Header from './Header.jsx'
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';
import api from './services/api.js'
import useChat from './hooks/useChat.js'
import useUsers from './hooks/useUsers.js'

 

function MainPage({token, setToken}){
    const [selectedUser, setSelectedUser] = useState()
    const {id: currentUser} = (jwtDecode(token))
    const {user, error: usersError} = useUsers(token, currentUser)
    const {messages, error: chatError, sendMessage} = useChat(selectedUser, token)
    
    useEffect(()=>{
        
    
         socket.emit('addUser',currentUser)
    }, [currentUser])
    return(
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