import React, {useState} from 'react'; 
import { useNavigate } from 'react-router-dom'



function LoginPage({setToken}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password , setPassword] = useState('')
  const handleLogin = async (event) =>{
    event.preventDefault();
    try{
   const response = await fetch(`http://localhost:5000/api/login`, {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
      
    })
    const data = await response.json()
    if (data.token){
      localStorage.setItem('token', data.token)
      setToken(data.token)
      alert('Вход успешен')
      navigate('/main')
      
    } else {
      alert('fail login')
    }
} catch(e) {
  console.error(e)
}
    console.log("Попытка входа с такими данными:", {email: email , password : password})
    

  }
  return (
    <div className="auth-page" >
    <form className="auth-form" onSubmit={handleLogin}>
   
      <h1>Вход</h1>
        <label htmlFor= "login-email"></label>
          <input value = {email} placeholder='email' onChange={(event)=>setEmail(event.target.value)} />
        <label htmlFor= "login-password"></label>
          <input value = {password} placeholder='password' onChange={(event)=>setPassword(event.target.value)} />
          <button type = 'submit'>Войти</button>
  
    </form>
    </div>
  );
}

export default LoginPage;