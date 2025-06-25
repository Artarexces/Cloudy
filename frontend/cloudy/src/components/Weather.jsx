import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

const Weather = ({ apiBaseUrl, token, logout }) => {
    const [city, setCity] = useState('');
    const [data, setData] = useState(null);
    const containerRef = useRef(null);
    const cardRef = useRef([]);
    const weekRef = useRef([]);


// Fondo de nubes animado

    useEffect(()=>{
        const clouds = containerRef.current.querySelectorAll('.cloud');
        clouds.forEach((cloud, i) => {
            gsap.to(cloud, {
            x: 300 + Math.random() * 100,
            duration: 15 + Math.random() * 6,
            ease:'none',
            repeat: -1,
            yoyo: true,
            delay: i * 1,
            });
        });
    },[])

// Effecto de bienvenida animado

    useEffect (() => {
        if(!data) return;
        const letters = containerRef.current.querySelectorAll('.bienvenida')
        gsap.fromTo(
            letters,
            {opacity: 0, y: 30},
            {opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out'},
        );
    }, [data]);


//  Animacion metricas del grid 

    useEffect(()=> {
        if(!data) return;
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        );
    }, [data]);


// //  Animacion pronostico semanal

//     useEffect(() => {
//         if (weekRef.current.length === 0)
//         gsap.fromTo(
//             weekRef.current, 
//             { opacity: 0, y: 20 },
//             { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
//         )
//     }, [forecast])

//  Fetchs de clima (Actual + daily)

    const fetchWeather = async (e) => {
        e.preventDefault();
        if(!city) return; 

        try {
            const res = await fetch(`${apiBaseUrl}/weather/?city=${city}`, 
                {
                headers: { 
                    Authorization: 'Token '+ token,
                },
              });   
            if(!res.ok) throw new Error('Ciudad no encontrada')
             setData(await res.json())
        } catch (error) {
            gsap.fromTo(
                containerRef.current.querySelector('input'),
                { x: -8 },
                { x: 8, duration: 0.08, repeat: 4, yoyo: true, ease: 'power1.inOut'},
            );
        }
    };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 relative" ref={containerRef}>
        <div className="cloud cloud-1 absolute bg-white/5 rounded-full w-48 h-16 top-10 left-0" />
        <div className="cloud cloud-2 absolute bg-white/5 rounded-full w-36 h-12 top-32 left-0" />
        <div className="cloud cloud-3 absolute bg-white/5 rounded-full w-44 h-14 top-52 left-0" />

        <button
          onClick={logout}
          className="self-end mb-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
        >
          Cerrar sesión
        </button>

        <form onSubmit={fetchWeather} className="flex gap-2 w-full max-w-md">
          <input
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa una ciudad"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            🔍
          </button>
        </form>
      </div>
    )
  }

  const {name, temp_c, feelslike_c, humidity, wind_kph, pressure_mb, precip_mm} = weatherData

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col items-center p-6' ref={containerRef}>
        <div className='cloud cloud-1 absolute bg-white/5 rounded-full w-48 h-16 top-10 left-0'/>
        <div className='cloud cloud-2 absolute bg-white/5 rounded-full w-48 h-16 top-10 left-0'/>
        <div className='cloud cloud-3 absolute bg-white/5 rounded-full w-48 h-16 top-10 left-0'/>

        <button 
          onClick={logout} 
          className='self-end mb-4 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300'
         >
          Cerrar sessión
        </button>


        <form onSubmit={fetchWeather} className='flex gap-2 w-full max-w-md mb-6' >
            <input
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='Buscar otra ciudad'
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <button 
              type="submit"
              className='px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
              >
                🔍
              </button>
        </form>

        {/* Banner bienvenida */}

        <h1 className='bienvenida text-3xl font-semibold text-gray-100 mb-6 inline-flex flex-wrap'>
            {`${ name }`.split('').map((ch,i)=>(
                <span key={i} className='inline-block'>{ch}</span>
            ))}
        </h1>

        {/* GRID metricas */}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8'>
          
         {/* Temperatura */}
          <div
            ref={el => (cardRef.current[0] = el)}
            className='bg-gray-800 p-4 rounded-xl border border-gray-700'
          >
            <h2 className='text-gray-400 mb-2'>Temperatura</h2>
            <p className='text-4xl text-gray-100 font-bold'>{Math.round(temp_c)}°C</p>
            <p className='text-gray-500'>Se siente como {Math.round(feelslike_c)}°C</p>
          </div>

            {/* Viento  */}
          <div
            ref={el => (cardRef.current[1] = el)}
            className='bg-gray-800 p-4 rounded-xl border border-gray-700'
          >
            <h2 className='text-gray-400 mb-2'>Viento</h2>
            <p className='text-4xl text-gray-100 font-bold'>{Math.round(wind_kph)}km/h</p>
            <p className='text-gray-500'>Humedad {humidity}%</p>
          </div>

            {/* Presion */}
          <div
            ref={el => (cardRef.current[2] = el)}
            className='bg-gray-800 p-4 rounded-xl border border-gray-700'
          >
            <h2 className='text-gray-400 mb-2'>Presión</h2>
            <p className='text-4xl text-gray-100 font-bold'>{pressure_mb} mb</p>
            <p className='text-gray-500'>Precipitación {precip_mm}mm</p>
          </div>
        </div>

    </div>
  )
}

export default Weather