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


    
    // useEffect(()=> {
      //     if(!data) return;
      //     gsap.fromTo(
        //         cardRef.current,
        //         { opacity: 0, y: 30 },
        //         { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        //     );
        // }, [data]);
        
  //  Animacion metricas del grid 
  
  useEffect(() => {
    if (!data) return

    // Para cada tarjeta de métricas…
    cardRef.current.forEach(card => {
      if (!card) return
      const enter = () => gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power1.out' })
      const leave = () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'power1.out' })

      card.addEventListener('mouseenter', enter)
      card.addEventListener('mouseleave', leave)

      // Limpieza
      return () => {
        card.removeEventListener('mouseenter', enter)
        card.removeEventListener('mouseleave', leave)
      }
    })

    // Y ahora el pronóstico semanal

    weekRef.current.forEach(card => {
      if (!card) return
      const enter = () => gsap.to(card, { y: -5, duration: 0.2, ease: 'power1.out' })
      const leave = () => gsap.to(card, { y: 0, duration: 0.2, ease: 'power1.out' })

      card.addEventListener('mouseenter', enter)
      card.addEventListener('mouseleave', leave)

      return () => {
        card.removeEventListener('mouseenter', enter)
        card.removeEventListener('mouseleave', leave)
      }
    })
  }, [data])


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
<div className="w-full min-h-screen bg-gray-900 flex flex-col items-center p-6 relative overflow-x-hidden" ref={containerRef}>
        <div className="cloud cloud-1 absolute bg-white/10 rounded-full w-48 h-16 top-10 left-0" />
        <div className="cloud cloud-2 absolute bg-white/10 rounded-full w-36 h-12 top-32 left-0" />
        <div className="cloud cloud-3 absolute bg-white/10 rounded-full w-44 h-14 top-52 left-0" />

        <button
          onClick={logout}
          className="self-end mr-8 mb-4 px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-gray-300"
        >
          Cerrar sesión
        </button>

        <form onSubmit={fetchWeather} className="flex gap-2 mb-8">
          <input
            className="flex-1 px-4 py-2 lg:w-120 md:w-80 sm:w-60 bg-[#2a2c38] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5e9cff]"
            placeholder="Ingresa una ciudad"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
          >
            🔍
          </button>
        </form>
      </div>
    )
  }

  const { current, forecast } = data
  const pressureBar = (current.pressure_mb / 1.333).toFixed(2)

  return (
    <div className='w-full min-h-screen bg-gray-900 flex flex-col items-center p-6 overflow-x-hidden' ref={containerRef}>
        <div className='cloud cloud-1 absolute bg-white/10 rounded-full w-48 h-16 top-10 left-0'/>
        <div className='cloud cloud-2 absolute bg-white/10 rounded-full w-36 h-12 top-32 left-0'/>
        <div className='cloud cloud-3 absolute bg-white/10 rounded-full w-44 h-14 top-52 left-0'/>

        <button 
          onClick={logout} 
          className='self-end mr-8 mb-4 px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-gray-300'
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

        {/* Titulo */}

        <h1 className='text-3xl font-semibold text-gray-100 mb-6 text-center flex-wrap'>
          Clima en {current.location?.name || city}
        </h1>

        {/* GRID metricas */}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8'>
          
         {/* Temperatura */}
          <div
            ref={el => (cardRef.current[0] = el)}
            className='bg-gray-800 rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-blue-400'
          >
            <h2 className='text-gray-400 mb-2'>Temperatura</h2>
            <p className='text-5xl text-gray-100 font-bold'>{Math.round(current.temp_c)}°C</p>
            <p className='text-gray-500 mt-1'>Se siente como {Math.round(current.feelslike_c)}°C</p>
          </div>

            {/* Viento  */}
          <div
            ref={el => (cardRef.current[1] = el)}
            className='bg-gray-800 rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-blue-400'
          >
            <h2 className='text-gray-400 mb-2'>Viento</h2>
            <p className='text-4xl text-gray-100 font-bold'>{Math.round(current.wind_kph)}km/h</p>
            <p className='text-gray-500'>Humedad {current.humidity}%</p>
          </div>

            {/* Presion */}
          <div
            ref={el => (cardRef.current[2] = el)}
            className='bg-gray-800 rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-blue-400'
          >
            <h2 className='text-gray-400 mb-2'>Presión</h2>
            <p className='text-4xl text-gray-100 font-bold'>{pressureBar}</p>
            <p className='text-gray-500 mt-1'>Bar</p>
          </div>

          {/* Precipitaciones */}
          <div
            ref={el => (cardRef.current[3] = el)}
            className='bg-gray-800 rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-blue-400'
           >
            <h2 className='text-gray-400 mb-2'>Precipitacion</h2>
            <div className='text-5xl font-bold text-[#5e9cff]'>{current.precip_mm || 0}</div>
            <p className='text-gray-500 mt-1'>mm/day</p>
          </div>

          {/* Humedad */}
          <div
            ref={el => (cardRef.current[4] = el)}
            className='bg-gray-800 rounded-xl border border-gray-700 p-6 cursor-pointer hover:border-blue-400'
           >
            <h2 className='text-gray-400 mb-2'>Humedad</h2>
            <div className='text-5xl font-bold text-[#5e9cff]'>{current.humidity}</div>
            <p className='text-gray-500 mt-1'>%</p>
          </div>          
        </div>

        {/* Pronostico semanal */}
      <div className='max-w-5xl mx-auto'>
        <h3 className='text-xl text-gray-300 mb-4'>Pronostico semanal</h3>
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4'>
          {forecast?.map((day, i) => (
            <div
              key={i}
              ref={el => (weekRef.current[i] = el)}
              className='bg-gray-800 border border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-400'
            >
              <p className='text-gray-100 font-semibold mb-1'>
                {new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}
              </p>
              <img src={day.day.condition.icon} alt="" className='mx-auto mb-1' />
              <p className='text-gray-100 font-semibold mb-1'>
                {Math.round(day.day.mintemp_c)} / {Math.round(day.day.maxtemp_c)}
              </p>
              <div className='flex justify-between text-gray-500 text-xs'>
                <span>💧{day.day.daily_chance_of_rain}%</span>
                <span>{Math.round(day.day.maxwind_kph)} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Weather