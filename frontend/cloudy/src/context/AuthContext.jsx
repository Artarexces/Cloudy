import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null); 

// Login 
    const login = async (username, password) => {
        const res = await fetch ('', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if(res.ok) {
            setToken(data.token)
            localStorage.setItem('token', data.token);
            return true;
        } else {
            alert('Error en el inicio de sesión');
            return false;
        }
    };

    // Logout 
    const logout = async () => {
        await fetch('', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        });
        setToken(null);
        localStorage.removeItem('token');
    };


  return (
    <AuthContext.Provider value={{ token, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}
