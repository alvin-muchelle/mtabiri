// /app/api/weather/forecast/route.ts
import { NextResponse } from 'next/server';

interface OWMForecastEntry {
  dt_txt: string;
  dt: number;
  main: { temp: number };
    weather: { icon: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const units = searchParams.get('units') ?? 'metric'; // 'metric' | 'imperial'

  if (!city) {
    return NextResponse.json({ error: 'Missing city parameter' }, { status: 400 });
  }

  try {
    // Geocoding request
    const geoRes = await fetch(
      `${process.env.NEXT_PUBLIC_GEOCODE_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER}`
    );
    const geoData = await geoRes.json();
    if (!geoData[0]) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const { lat, lon } = geoData[0];

    // Fetch forecast from OpenWeather API
    const forecastRes = await fetch(
      `${process.env.NEXT_PUBLIC_FORECAST}?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER}`
    );
    const forecastData = await forecastRes.json();
    const list: OWMForecastEntry[] = forecastData.list;

    const result = list
      .filter((entry) => entry.dt_txt.includes('12:00:00'))
      .slice(1, 4)
      .map((entry) => ({
        date: entry.dt_txt,
        temperature: entry.main.temp,
        icon: entry.weather[0].icon,
      }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 });
  }
}
