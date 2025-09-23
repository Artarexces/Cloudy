export interface OwmCurrent {
  coord: { lat: number; lon: number };
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind?: { speed: number };
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
  name: string;
}
export interface OwmForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { icon: string }[];
  wind: { speed: number };
  pop?: number;
}
export interface OwmForecast { list: OwmForecastItem[]; }
