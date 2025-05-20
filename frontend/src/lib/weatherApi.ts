import type { Weather, ForecastItem } from '../types/weather';

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
const GEO_URL = process.env.NEXT_PUBLIC_GEOCODE_URL!;
const KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY!;

export async function fetchGeocode(city: string): Promise<GeocodeResult[]> {
  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocode request failed (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch current weather for given lat/lon & units.
 */
export async function fetchCurrent(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): Promise<Weather> {
  const res = await fetch(
    `${API_BASE}/weather/current?lat=${lat}&lon=${lon}&units=${units}`
  );
  if (!res.ok) throw new Error(`Current weather fetch failed (${res.status})`);
  const json = await res.json();
  // If your API wraps data in `data`, e.g. { data: {...} }, adjust here:
  return json.data ?? json;
}

/**
 * Fetch 3-day forecast for given lat/lon & units.
 * Assumes your Laravel endpoint returns an array of ForecastItem.
 */
export async function fetchForecast(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): Promise<ForecastItem[]> {
  const res = await fetch(
    `${API_BASE}/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`
  );
  if (!res.ok) throw new Error(`Forecast fetch failed (${res.status})`);
  const json = await res.json();
  // If wrapped in `data`, adjust accordingly:
  return json.data ?? json;
}