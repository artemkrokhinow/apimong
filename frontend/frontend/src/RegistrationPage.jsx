import React, {useState} from 'react'; 
import {useNavigate} from 'react-router-dom'
function RegistrationPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password , setPassword] = useState('')
    const handleLogin = async (event) =>{
      event.preventDefault();
      try{
     const response = await fetch(`http://localhost:5000/api/registration`, {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        
      })
      const data = await response.json()
      if (response.ok){
        alert('registration successful')
        navigate('/login')
      } else {
        alert('fail login')
      }
  } catch(e) {
    console.error(e)
  }
      console.log("Попытка входа с такими данными:", {email: email , password : password})
      alert(`Вы пытаетесь войти с email: ${email}`)
    }
    return (
      <form onSubmit={handleLogin}>
      <div className="App">
        <h1>Registration</h1>
          <label htmlFor= "login-email"></label>
            <input value = {email} placeholder='email' onChange={(event)=>setEmail(event.target.value)} />
          <label htmlFor= "login-password"></label>
            <input value = {password} placeholder='password' onChange={(event)=>setPassword(event.target.value)} />
            <button type = 'submit'>Войти</button>
      </div>
      </form>
    );
}

export default RegistrationPage;