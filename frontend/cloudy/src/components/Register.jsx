import React, { useState, useRef, useEffect} from 'react'
import { gsap } from 'gsap'
const Register = ({ switchToLogin }) => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const formRef = useRef(null);

    useEffect(()=> {
        gsap.set(formRef.current, { padding: '20px'});
        gsap.from(formRef.current, {opacity: 0, y: 50, duration: 1});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('',{
            method:'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if(res.ok) {
            alert('Usuario creado correctamente. Por favor, inicia sesión.');
            switchToLogin();
        } else {
            alert('Error al registrar usuario');
        }
    };
  return (
    <div ref={formRef}>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Usuario:</label>
                <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Contraseña:</label>
                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Crear cuenta</button>
        </form>
        <p>
            ¿Ya tienes cuenta?{' '}
            <button onClick={switchToLogin}>Iniciar sesión</button> 
        </p>
    </div>
  );
}

export default Register