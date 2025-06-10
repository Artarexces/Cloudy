import React from 'react'
import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'


const App = () => { 

  const [view, setView] = useState('login')
  const [token, setToken] = useState(localStorage.getItem('token') || null)


//  Funcion de logeo manual

  const handleLogin = async ( username, password ) => {
    try {
      const res = await fetch('', {
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

  const heandleLogout = async ( ) => {
    fetch ('', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        Authorization: 'Token', token        
      }
    }).finally (() => { 
      localStorage.removeItem('token');
      setToken(null)
      setView('login')
    });
  };

//  Funcion de registro manual

  const handleRegister = async (username, password) => {
    try {
      const res = await fetch('', {
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
    <div>App</div>
  )
}

export default App