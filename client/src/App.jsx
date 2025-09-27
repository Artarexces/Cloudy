import React from 'react'
import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Weather from './components/Weather'
import './styles.css'


const App = () => { 

  const [view, setView] = useState('login')
  const [token, setToken] = useState(localStorage.getItem('token') || null)

// META ENV 

const API = import.meta.env.VITE_API_URL;





//  CONTROLADORES FETCH  

//  Funcion de logeo manual
  const handleLogin = async ( username, password ) => {
    try {
      const res = await fetch(`${API}/login`.replace(/\s+/g, ''), {
        method: 'POST',
        headers:{ 'Content-Type' : 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if(!res.ok) throw new Error('Credenciales inválidas')
        const data = await res.json();
      localStorage.setItem('token',data.token)
      setToken(data.token);
      setView('weather');
      return true
    } catch (error) {
      return false;
    }
  };


//  Funcion de deslogeo manual
  const handleLogout = async ( ) => {
    try {
    await fetch(`${API}/logout`.replace(/\s+/g, ''), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
    })      
    } catch (error) {
      console.error('Error al deslogearse:', error)
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setView('login')
    }
  };


//  Funcion de registro manual
  const handleRegister = async (username, password) => {
    try {
      const res = await fetch(`${API}/register`.replace(/\s+/g, ''), {
        method:'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({username, password})
      });
      if(!res.ok) throw new Error('Error al registrar');
      return true;
    } catch (error) {
      return false;
    }
  };


  if(!token && view === 'weather') {
    setView('login')
  }

return (
  <>
    {view === 'login' && (
      <Login
        onLogin={handleLogin} 
        switchToRegister={() => setView('register')}
      />
    )}

    {view === 'register' && (
      <Register
      onRegister={handleRegister} 
      switchToLogin={()=> setView('login')}/>
    )}

    {view === 'weather' && token && (
      <Weather
          apiBaseUrl={API}
          token={token}
          logout={handleLogout}
      />
    )} 
  </>
  );
}

export default App