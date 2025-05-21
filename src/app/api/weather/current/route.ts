import { NextRequest, NextResponse } from 'next/server';
import { getCurrentWeatherByCity, getCurrentWeatherByCoords } from '@/lib/weatherApi';
import { formatInTimeZone } from 'date-fns-tz';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city') ?? 'Nairobi';
    const rawUnits = searchParams.get('units');
    const units = rawUnits === 'imperial' ? 'imperial' : 'metric';

    let cacheKey: string;
    let data;

    if (lat && lon) {
      cacheKey = `weather:current:coords:${lat}:${lon}:${units}`;
      data = cache.get(cacheKey) ?? await getCurrentWeatherByCoords(+lat, +lon, units);
    } else {
      cacheKey = `weather:current:city:${city}:${units}`;
      data = cache.get(cacheKey) ?? await getCurrentWeatherByCity(city, units);
    }

    cache.set(cacheKey, data);

    const response = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      wind_speed: data.wind.speed,
      date: formatInTimeZone(new Date(), 'Africa/Nairobi', 'yyyy-MM-dd HH:mm:ss'),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unable to fetch current weather.' }, { status: 502 });
  }
}
