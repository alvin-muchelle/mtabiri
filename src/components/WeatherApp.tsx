"use client"

import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherIcon } from '@/components/WeatherIcon';
import { WiStrongWind, WiHumidity } from 'react-icons/wi';
import WelcomeBanner from './WelcomeBanner';

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
  const [city, setCity] = useState<string>('');
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  function titleCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  }

  async function handleSearchByCoords(lat: number, lon: number) {
    setError(null);
    setIsLoading(true);
    try {
      const units = isCelsius ? 'metric' : 'imperial';

      const currentRes = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}&units=${units}`);
      const currentData = await currentRes.json();
      currentData.city = titleCase(currentData.city);
      setCurrent(currentData);

      const forecastRes = await fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`);
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setCurrent(null);
      setForecast([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-2 sm:p-4 w-full">
      {/* Search Bar & Toggle */}
      <div className="flex items-center justify-center mb-6">
        <SearchBar
          onSelect={({ name, lat, lon }) => {
            setCity(titleCase(name));
            handleSearchByCoords(lat, lon);
          }}
          isCelsius={isCelsius}
          onToggleTemp={() => setIsCelsius(!isCelsius)}
          disabledToggle={!current}
        />
      </div>
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <WelcomeBanner />
      
      {/* Display searched city */}
      {current && !isLoading && (
        <p className="text-center text-lg font-medium mb-2">Weather in {city}</p>
      )}

      {/* Current Weather Section */}
      {current && !isLoading && (
        <Card className="mb-6">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col items-start space-y-2 mb-4">
              <WeatherIcon code={current.icon} width={100} height={100} />
              <div className="text-6xl font-bold">
                {convertTemp(current.temperature)}
              </div>
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
      {current && !isLoading && (
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

      {/* Forecast Section */}
      {forecast.length > 0 && !isLoading && (
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
