import React, { useEffect, useState, useRef, useContext } from 'react'
import { gsap } from 'gsap'

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const containerRef = useRef(null);
    const cardRef = useRef([]);
    const weekRef = useRef([]);


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

// Effecto de bienvenida 

    useEffect (() => {
        if(!weatherData) return;
        
    })
    return (
    <div>Weather</div>
  )
}

export default Weather