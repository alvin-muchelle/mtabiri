import type { Weather, ForecastItem } from '../types/weather';

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// These should stay as public (OpenWeatherMap URLs)
const GEO_URL = process.env.NEXT_PUBLIC_GEOCODE_URL!;
const OPENWEATHER_KEY = process.env.NEXT_PUBLIC_OPENWEATHER!;

// 🔁 Use relative URLs for internal API routes (Next.js server routes)
const API_BASE = ''; // ← empty string lets `/api/...` resolve correctly on all environments

export async function fetchGeocode(city: string): Promise<GeocodeResult[]> {
  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocode request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchCurrent(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): Promise<Weather> {
  const res = await fetch(`${API_BASE}/api/weather/current?lat=${lat}&lon=${lon}&units=${units}`);
  if (!res.ok) throw new Error(`Current weather fetch failed (${res.status})`);
  const json = await res.json();
  return json.data ?? json;
}

export async function fetchForecast(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): Promise<ForecastItem[]> {
  const res = await fetch(`${API_BASE}/api/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`);
  if (!res.ok) throw new Error(`Forecast fetch failed (${res.status})`);
  const json = await res.json();
  return json.data ?? json;
}

export async function getCurrentWeatherByCoords(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeather current fetch failed (${res.status})`);
  return res.json();
}

export async function getCurrentWeatherByCity(
  city: string,
  units: 'metric' | 'imperial'
) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${OPENWEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeather city fetch failed (${res.status})`);
  return res.json();
}
