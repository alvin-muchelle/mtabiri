"use client"

import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherIcon } from '@/components/WeatherIcon';
import { WiStrongWind, WiHumidity } from 'react-icons/wi';

interface CurrentWeather {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  date: string;
}

interface ForecastItem {
  date: string;
  temperature: number;
  icon: string;
}

export function WeatherApp() {
  const [_city, setCity] = useState<string>('');
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [_isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (searchCity: string) => {
    if (!searchCity) return;
    setError(null);
    setIsLoading(true);
    setCity(searchCity);

    try {
      const units = isCelsius ? 'metric' : 'imperial';

      const currentRes = await fetch(`/api/weather/current?city=${searchCity}&units=${units}`);
      if (!currentRes.ok) throw new Error('Failed to fetch current weather');
      const currentData = await currentRes.json();
      setCurrent(currentData);

      const forecastRes = await fetch(`/api/weather/forecast?city=${searchCity}&units=${units}`);
      if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setCurrent(null);
      setForecast([]);
    } finally {
      setIsLoading(false);
    }
  };

  const convertTemp = (temp: number) =>
    isCelsius ? `${Math.round(temp)}°C` : `${Math.round((temp * 9) / 5 + 32)}°F`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Search Bar centered */}
      <div className="flex items-center justify-center mb-6">
        <SearchBar
          onSearch={handleSearch}
          isCelsius={isCelsius}
          onToggleTemp={() => setIsCelsius(!isCelsius)}
          disabledToggle={!current}
        />
      </div>

      {/* Current Weather Section */}
      {current && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col items-start space-y-2 mb-4">
              <WeatherIcon code={current.icon} width={100} height={100} />
              <div className="text-6xl font-bold">{convertTemp(current.temperature)}</div>
              <p className="capitalize text-muted-foreground">
                {current.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(current.date)}, {current.city}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Stats Section */}
      {current && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-4">
              <WiStrongWind size={30} className="text-2xl mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-lg font-medium">
                  {isCelsius
                    ? `${current.wind_speed.toFixed(1)} km/h`
                    : `${(current.wind_speed * 0.621371).toFixed(1)} mph`}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <WiHumidity size={30} className="text-2xl mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-medium">{current.humidity}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Forecast Section below search bar */}
      {forecast.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {forecast.map((item) => (
            <Card key={item.date} className="text-center">
              <CardContent className="p-4">
                <p className="font-medium mb-2">{formatDate(item.date)}</p>
                <WeatherIcon code={item.icon} width={80} height={80} />
                <p className="mt-2 text-lg">{convertTemp(item.temperature)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <Card className="mt-6 border-destructive">
          <CardContent className="p-4 text-destructive">{error}</CardContent>
        </Card>
      )}
    </div>
  );
}
