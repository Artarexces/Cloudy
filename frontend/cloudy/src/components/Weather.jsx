import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

const Weather = ({ apiBaseUrl, owmKey, token, logout }) => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const containerRef = useRef(null);
    const cardRef = useRef([]);
    const weekRef = useRef([]);


// Fondo de nubes animado

    useEffect(()=>{
        const clouds = containerRef.current.querySelectorAll('.cloud');
        clouds.forEach((cloud, i) => {
            const distance = 200 + Math.random() * 100;
            const duration = 12 + Math.random() * 6;
            gsap.to(cloud, {
            x: distance,
            duration:duration,
            ease:'none',
            repeat: -1,
            yoyo: true,
            delay: i * 1,
            });
        });
    })

// Effecto de bienvenida animado

    useEffect (() => {
        if(!weatherData) return;
        const letters = containerRef.current.querySelectorAll('.bienvenida span')
        gsap.fromTo(
            letters,
            {opacity: 0, y: 20},
            {opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out'},
        );
    }, [weatherData]);


//  Animacion metricas del grid 

    useEffect(()=> {
        if(!weatherData) return;
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        );
    }, [weatherData]);


//  Animacion pronostico semanal

    useEffect(() => {
        if (weekRef.current.length === 0)
        gsap.fromTo(
            weekRef.current, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        )
    })

//  Fetchs de clima (Actual + daily)

    const fetchWeather = async (e) => {
        e.preventDefault();
        if(!city) return; 

        try {
            const res = await fetch(`${apiBaseUrl}/weather/?city=${city}&appid=${owmKey}`, 
                {
                headers: { 
                    Authorization: 'Token '+ token,
                },
              }
            )   
            if(!res.ok) throw new Error('Ciudad no encontrada')
            const data = await res.json();
            setWeatherData({ current: data.current, cityName: city})
            setForecast(data.daily.slice(0,7));
        } catch (error) {
            gsap.fromTo(
                containerRef.current.querySelector('.city-input'),
                { x: -8 },
                { x: 8, duration: 0.08, repeat: 4, yoyo: true, ease: 'power1.inOut'},
            );
        }
    };

    if (!weatherData) {
        return (
            <div ref={containerRef} className="weather-container">
                <div className="background-effect">
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                    <div className="cloud cloud-3"></div>
                </div>

                <button className="logout-btn" onClick={logout}>Cerrar sesión</button>

                <form className="search-form" onSubmit={fetchWeather}>
                    <input 
                    type="text"
                    placeholder='Ingresa una ciudad'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='city-input'
                     />
                    <button type='submit' className="btn-primary">Buscar🔍</button>
                </form>
            </div> 
        );
    }

    const { current, cityName } = weatherData;

return (
    <div ref={containerRef} className="weather-container">
        <div className="background-effect">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
        </div>
        
        <button className="logout-btn" onClick={logout}>Cerrar sesión</button>

        <form className='search-form' onSubmit={fetchWeather}>
            <input 
                type="text"
                placeholder='Ingresa otra cuidad'
                value={city}
                onChange={(e) => setCity (e.target.value)}
                className='city-input'
             />
             <button type="submit" className='btn-primary'>Buscar🔍</button>
        </form>

        {/* Banner de bienvenida */}

        <div className="bienvenida">
            {`Clima en ${cityName}`.split('').map((char, idx) => (
                <span key={idx} style={{ display: 'inline-block'}}>
                    {char}
                </span>
            ))}
        </div>

        {/* GRID SUPERIOR: 6 Metricas */}
        <div className="metrics-grid">
            <div className="metric-card" ref={(el) => (cardRef.current[0] = el)}>
                <div className="metric-header">Temperatura</div>
                <div className="metric-value">
                    <span className="icon-sun"></span>
                    {Math.round(current.temp)}
                    <span className='unit'>°C</span>
                </div>
                <div className="metric-subtext">
                    punto de rocio {Math.round(current.dew_point)}°C
                    <br />
                    se siente como {Math.round(current.feels_like)}°C
                </div>
            </div>

            {/* Velocidad el viento */}
            <div className="metric-card" ref={(el) => (cardRef.current[1] = el)}>
                <div className="metric-header">Velocidad del viento</div>
                <div className="metric-value">
                    {Math.round(current.wind_speed)}
                    <span className='unit'>Km/s</span>
                </div>
                <div className="metric-subtext">
                    Max {Math.round(current.wind_gust || current.wind_speed)} Km/s
                </div>
            </div>

            {/* Direccion del viento */}
            <div className="metric-card" ref={(el) => (cardRef.current[2] = el)}>
                <div className="metric-header">Dirección del viento</div>
                <div className="metric-value" style={{fontSize: '24px', justifyContent: 'center'}}>
                    {current.wind_deg}°{' '}
                    <span className="unit">
                        {current.wind_deg >= 337 || current.wind_deg < 23
                        ? 'N'
                        : current.wind_deg < 68
                        ? 'NE'
                        : current.wind_deg < 113
                        ? 'E'
                        : current.wind_deg < 158
                        ? 'SE'
                        : current.wind_deg < 203
                        ? 'S'
                        : current.wind_deg < 248
                        ? 'SW'
                        : current.wind_deg < 293
                        ? 'W'
                        : 'NW'}
                    </span>
                </div>
                <div className="metric-subtext">Grados</div>
            </div>

            {/* Presion */}
            <div className="metric-card" ref={(el) => (cardRef.current[3] = el)}>
                <div className="metric-header">Presión</div>
                <div className="metric-value">
                    {Math.round(current.pressue / 1.333)}
                    <span className='unit'>Bar</span>
                </div>
                <div className="metric-subtext">
                    Cambios de presión: {current.pressue_change?.toFixed(2) || '0.00'}
                </div>
            </div>

            {/* Precipitaciones */}
            <div className="metric-card" ref={(el) => (cardRef.current[4] = el)}>
                <div className="metric-header">Precipitaciones</div>
                <div className="metric-value">
                    {current.rain ? current.rain['1h'] : 0}
                    <span className='unit'>mm/h</span>
                </div>
                <div className="metric-subtext">
                    {current.weather[0].main}
                </div>
            </div>

            {/* Humedad */}
            <div className="metric-card" ref={(el) => (cardRef.current[5] = el)}>
                <div className="metric-header">Humedad</div>
                <div className="metric-value">
                    {current.humidity}
                    <span className='unit'>%</span>
                </div>
                <div className="metric-subtext">
                    Max {Math.round(current.humidity)}%
                </div>
            </div>
        </div>

        {/* PRONOSTICO SEMANAL */}
        <div className="week-forecast-container">
            <div className="week-forecast-grid">
                {forecast.map((day, idx)=>{
                    const date = new Date(day.dt * 1000);
                    const dayLabel = date.toLocaleDateString('en-US', {
                        weekday: 'short',
                    });
                    const iconCode = day.weather[0].icon;
                    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`

                    return (
                    <div 
                        className="forecas-card"
                        key={idx}
                        ref={(el) => (weekRef.current[idx] = el)}
                        >
                        <div className="day-label">{dayLabel}</div>
                        <div className="icon-small" style={{backgroundImage:`url(${iconUrl})`,}}></div>
                        <div className="temp-range-small">
                            {Math.round(day.temp.min)} / {Math.round(day.temp.max)}
                        </div>
                        <div className="details-small">
                            <span>
                                {day.weather[0].main === 'Rain'
                                  ? `${Math.round(day.pop *100)}%`
                                  : '0%'}{' '}
                                💧
                            </span>
                            <span>{`${Math.round(day.wind_speed)} km/s`}</span>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Weather