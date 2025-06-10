import React, { useEffect, useState, useRef, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { gsap } from 'gsap'

const Weather = () => {
    const { token, logout } = useContext(AuthContext);
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState(null);
    const containerRef = useRef(null);

    useEffect(()=> {
        gsap.set(containerRef.current, { padding: '20px' });
    }, []);

    useEffect(()=>{
        if(weatherData) {
            gsap.from(containerRef.current, { opacity: 0, y: -50, duration: 1 });
        }
    }, [weatherData]);
    

    return (
    <div>Weather</div>
  )
}

export default Weather