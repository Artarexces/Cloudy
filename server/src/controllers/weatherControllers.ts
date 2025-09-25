import axios from "axios";
import { Response } from "express";
import History from "../models/History";
import { AuthRequest } from "../middlewares/auth";
import { OwmCurrent, OwmForecast } from "../types/weather"; 

export const weather = async (req: AuthRequest, res: Response) => {
  try {
    const city = String(req.query.city || "");
    if (!city) return res.status(400).json({ error: "Ingrese una ciudad." });
    const key = process.env.OWM_API_KEY;
    if (!key) return res.status(500).json({ error: "Falta API key." });

    const cur = (await axios.get<OwmCurrent>(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=es`
    )).data;

    const forecastRes = (await axios.get<OwmForecast>(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${cur.coord.lat}&lon=${cur.coord.lon}&appid=${key}&units=metric&lang=es`
    )).data;

    // agrupar por día
    const groups: Record<string, typeof forecastRes.list> = {};
    forecastRes.list.forEach((it) => {
      const day = it.dt_txt.split(" ")[0];
      (groups[day] ||= []).push(it);
    });

    const forecast = Object.keys(groups).slice(0, 7).map((dayKey) => {
      const items = groups[dayKey];
      const temps = items.map(i => i.main.temp);
      const mintemp_c = Math.min(...temps);
      const maxtemp_c = Math.max(...temps);
      const maxwind_kph = Math.max(...items.map(i => (i.wind?.speed ?? 0) * 3.6));
      const daily_chance_of_rain = Math.round(Math.max(...items.map(i => (i.pop ?? 0) * 100)));
      const mid = items.find(i => i.dt_txt.includes("12:00:00")) ?? items[Math.floor(items.length / 2)];
      const icon = mid?.weather?.[0]?.icon ?? "01d";
      return {
        date: `${dayKey}T12:00:00`,
        day: {
          condition: { icon: `http://openweathermap.org/img/wn/${icon}@2x.png` },
          mintemp_c,
          maxtemp_c,
          daily_chance_of_rain,
          maxwind_kph: Math.round(maxwind_kph)
        }
      };
    });

    if (!req.userId) return res.status(401).json({ error: "Usuario no autenticado" });
    await History.create({ user: req.userId, city: cur.name });

    return res.json({
      current: {
        location: { name: cur.name },
        temp_c: Math.round((cur.main?.temp ?? 0) * 10) / 10,
        feelslike_c: Math.round((cur.main?.feels_like ?? 0) * 10) / 10,
        wind_kph: Math.round((cur.wind?.speed ?? 0) * 3.6),
        humidity: cur.main?.humidity ?? 0,
        pressure_mb: cur.main?.pressure ?? 0,
        precip_mm: (cur.rain?.["1h"] ?? cur.rain?.["3h"] ?? cur.snow?.["1h"] ?? cur.snow?.["3h"] ?? 0)
      },
      forecast
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
