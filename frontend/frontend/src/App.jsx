import React, {useState} from 'react'; 
import LoginPage from './LoginPage.jsx'
import RegistrationPage from './RegistrationPage.jsx'
import { Route, Routes, Link, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './MainPage.jsx';
function App() {
  const [ token ,setToken  ] = useState(localStorage.getItem('token'))
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
  }
  return (
    <BrowserRouter>
    <div className="App">
      
     {!token && (
        <nav>
          <Link to = '/Login'>Login</Link> | 
       <Link to = '/Registration'>Registration</Link>
      
    </nav>
  )}
    <Routes>
      {token ? (
        <>
        <Route path = '*' element={<Navigate to = '/main'/>}/>
   <Route path = '/main' element= {<MainPage token={token} setToken={setToken} handleLogout={handleLogout} />} />
   </>
      ):(
        <>
         <Route path = '/Login' element ={<LoginPage setToken = {setToken}/>} />
        <Route path = '/Registration' element ={<RegistrationPage setToken = {setToken}/>}/>
        <Route path = '*' element={<Navigate to = '/login'/>}/>
        </>
      )}
    </Routes>


    </div>
    </BrowserRouter>
  );
}

export default App;