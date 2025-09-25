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
        const res = await fetch('http://localhost:8500/api/register',{
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
<div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div ref={formRef} className='bg-gray-800 p-8 rounded-2xl shadow-2xl w-80'>
        <h2 className='text-3xl text-gray-100 font-semibold mb-6 text-center'>Registrarse</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-gray-400 mb-1'>Usuario:</label>
                <input 
                type="text"
                placeholder='Usuario'
                value={username}
                className='w-full px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label className='block text-gray-400 mb-1'>Contraseña:</label>
                <input 
                type="password"
                placeholder='Contraseña'
                value={password}
                className='w-full px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className='w-full py-2 bg-blue-600 rounded-4xl hover:bg-blue-700 text-white font-medium transition'>Crear cuenta</button>
        </form>
        <p className='mt-4 text-center text-gray-400'>
            ¿Ya tienes cuenta?<span onClick={switchToLogin} className='text-blue-400 hover:underline cursor-pointer'>Iniciar sesión</span> 
        </p>
    </div>
</div>
  )
}

export default Register