import React, { useEffect, useState, useRef, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { gsap } from 'gsap'

const Login = ({ switchToRegister }) => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const formRef = useRef(null);

    useEffect(()=> {
        gsap.set(formRef.current, {padding: '20px'});
        gsap.from(formRef.current, { opacity: 0, y: -50, duration: 1});
    },[])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const success = await login(username, password);
        if(!success){
            gsap.fromTo(
                formRef.current,
                {x: -10},
                {x: 10, duration: 0.1, repeat: 5, yoyo: true, ease:'power1.inOut', }
            );
        }
    };
    return (
    <div ref={formRef}>
        <h2>Iniciar sesión</h2>
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
                <label>Contraseña</label>
                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Iniciar sesión</button>
        </form>
        <p>
            ¿No tienes cuenta?,Registrate!{' '}
            <button onClick={switchToRegister}>Registrate</button>
        </p>
    </div>
  )
}

export default Login