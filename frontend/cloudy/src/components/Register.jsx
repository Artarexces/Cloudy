import React, { useState, useRef, useEffect} from 'react'
import { gsap } from 'gsap'

const Register = ({ switchToLogin }) => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const formRef = useRef(null);

    useEffect(()=> {
        gsap.set(formRef.current, {opacity: 0, y: 50, duration: 1});
        gsap.to(formRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch('http://localhost:8000/api/register/',{
            method:'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if(!res.ok) throw new Error('Error al registrar');
        switchToLogin(); 
        } catch (error) {
            gsap.fromTo(
                formRef.current,
                {x:-8},
                {x:8, duration: 0.08, repeat: 4, yoyo: true, ease: 'power1.inOut'}
            )
        }
    };
return (
<div className="app-container">
    <div ref={formRef} className='form-container'>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Usuario:</label>
                <input 
                type="text"
                placeholder='Usuario'
                value={username}
                className='input-field'
                required
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Contraseña:</label>
                <input 
                type="password"
                placeholder='Contraseña'
                value={password}
                className='input-field'
                required
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className='btn-primary'>Crear cuenta</button>
        </form>
        <p className='text-link'>
            ¿Ya tienes cuenta?<span onClick={switchToLogin}>Iniciar sesión</span> 
        </p>
    </div>
</div>
  )
}

export default Register