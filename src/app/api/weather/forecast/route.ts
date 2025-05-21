// /app/api/weather/forecast/route.ts
import { NextResponse } from 'next/server';
import { fetchGeocode } from '@/lib/weatherApi';
import { format, parseISO } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const cityParam = searchParams.get('city');
  const rawUnits = searchParams.get('units');
  const units: 'metric' | 'imperial' = rawUnits === 'imperial' ? 'imperial' : 'metric';

  let lat: number;
  let lon: number;

  // Branch on coords vs city
  if (latParam && lonParam) {
    lat = parseFloat(latParam);
    lon = parseFloat(lonParam);
  } else if (cityParam) {
    // geocode to get coords
    const geo = await fetchGeocode(cityParam, 1);
    if (!geo[0]) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    lat = geo[0].lat;
    lon = geo[0].lon;
  } else {
    return NextResponse.json({ error: 'Missing city or coordinates' }, { status: 400 });
  }

  try {
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER}`
    );
    if (!forecastRes.ok) {
      throw new Error(`OpenWeather forecast fetch failed (${forecastRes.status})`);
    }
    const forecastData = await forecastRes.json();

    // filter for 09:00:00 snapshots, next 3 days
    const entries = forecastData.list as any[];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = format(tomorrow, 'yyyy-MM-dd');

    const threeDays = entries
      .filter(item => item.dt_txt.includes('12:00:00'))
      .filter(item => item.dt_txt >= `${tomorrowDate} 12:00:00`)
      .slice(0, 3)
      .map(item => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        icon: item.weather[0].icon,
      }));

    return NextResponse.json(threeDays);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 502 });
  }
}
