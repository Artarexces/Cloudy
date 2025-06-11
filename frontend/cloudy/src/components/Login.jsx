import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

const Login = ({ onLogin ,switchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const formRef = useRef(null);

    useEffect(()=> {
        gsap.set(formRef.current, {opacity: 0, y: -50});
        gsap.to(formRef.current, { 
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease:'power3.out'
        });
    },[])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const success = await onLogin(username, password);
        if(!success){
            gsap.fromTo(
                formRef.current,
                {x: -10},
                {x: 10, duration: 0.1, repeat: 5, yoyo: true, ease:'power1.inOut', }
            );
        }
    };
    return (
<div className="app-container">
    <div ref={formRef} className='form-container'>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Usuario:</label>
                <input 
                type="text"
                value={username}
                required
                className='input-field'
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Contraseña</label>
                <input 
                type="password"
                value={password}
                required
                className='input-field'
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className='btn-primary'>Iniciar sesión</button>
        </form>
        <p className='text-link'>
            ¿No tienes cuenta? Registrate{' '}
            <span onClick={switchToRegister}>Registrate</span>
        </p>
    </div>
</div>
  )
}

export default Login