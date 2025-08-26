const BASE_URL = "http://localhost:5000/api"

 async function request(url , options = {}){
    const token = localStorage.getItem('token')
    const headers = {'Content-Type':'application/json'}
    if(token){
        headers['Authorization'] = `Bearer ${token}`
      
    } const config = {...options, headers}
    try{
        const response = await fetch (BASE_URL + url, config)
        const data = await response.json()
        if(response.ok){
            return data 
    } else{
           throw new Error(data.message || 'API Error');
    }
    
}catch (error){
    console.error('API Service Error:', error);
    throw error;
}

}
const api = {
    getContacts: ()=>{
       return  request('/contacts')
    }, 
    getMessages: (selectedUser)=>{
        return request(`/chat/${selectedUser._id}`, {cache: 'no-cache'}) 
    },
    login:(email, password)=>{
        return request('/login',{
            method: 'POST',
            body:JSON.stringify({email, password})
        })
    },
    registration:(email, password)=>{
        return request('/registration',{
            method: 'POST',
            body:JSON.stringify({email, password})
        })
    }

};
export default api; 