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
<div className='min-h-screen flex items-center justify-center bg-gray-900'>
    <div ref={formRef} className='bg-gray-800 p-8 rounded-2xl shadow-2xl w-80'>
        <h2 className='text-3xl text-gray-100 font-semibold mb-6 text-center'>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-gray-400 mb-1'>Usuario:</label>
                <input 
                type="text"
                value={username}
                required
                className='w-full px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label className='block text-gray-400 mb-1'>Contraseña</label>
                <input 
                type="password"
                value={password}
                required
                className='w-full px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className='w-full py-2 bg-blue-600 rounded-4xl hover:bg-blue-700 text-white font-medium transition'>Iniciar sesión</button>
        </form>
        <p className='mt-4 text-center text-gray-400'>
            ¿No tienes cuenta? Registrate{' '}
            <span onClick={switchToRegister} className='text-blue-400 hover:underline cursor-pointer' >Registrate</span>
        </p>
    </div>
</div>
  )
}

export default Login