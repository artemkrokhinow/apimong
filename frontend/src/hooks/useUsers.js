import { useState, useEffect } from 'react';
import api from '../services/api.js';

   export function useUsers (token, currentUser){
const [users, setUsers] = useState([]);
const [error, setError] = useState('');
 useEffect(()=>{
    if(!token) return;
    
        const  fetchUsers = async ()=>{
            try{
                setError('')
                const data = await api.getContacts()
                const filterData = data.filter(user =>user._id !== currentUser)
                setUsers(filterData)
            }catch(err){
                setError(err.message)
            }

        }
        fetchUsers()
},[ token, currentUser])
return{users, error}
  }
 