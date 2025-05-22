"use client"

import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Card, CardContent } from '@/components/ui/card';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { ForecastCard } from './ForecastCard';
import { WiStrongWind, WiHumidity } from 'react-icons/wi';
import WelcomeBanner from './WelcomeBanner';
import { ModeToggle } from "./ModeToggle";
import { TempToggle } from './TempToggle';

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
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
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
    <div className="w-full sm:px-6 md:px-8 lg:px-10 max-w-screen-md mx-auto">
      <div className="py-4">
        <ModeToggle />
      </div>
      {/* Search Bar & Toggle */}
      <div className="flex items-center justify-center mb-6">
        <SearchBar
          onSelect={({ lat, lon }) => {
            handleSearchByCoords(lat, lon);
          }}
          isCelsius={isCelsius}
          onToggleTemp={() => setIsCelsius(!isCelsius)}
          disabledToggle={!current}
        />
        <div className='px-4'>
          <TempToggle
            isCelsius={isCelsius}
            onToggle={() => setIsCelsius((c) => !c)}
            disabled={!current}
          />
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <WelcomeBanner />

      {/* Current Weather Card */}
      <div className="flex flex-col md:flex-row gap-4">
        {current && !isLoading && (
          <div className="w-full md:w-1/3">
            <CurrentWeatherCard data={current} isCelsius={isCelsius} />
          </div>
        )}

        {/* Stats and Forecast section */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {/* Top: Stats side-by-side */}
          {current && !isLoading && (
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-center dark:text-gray-100">
                  <WiStrongWind size={30} className="mx-auto mb-2" />
                  <p className="text-sm">Wind Speed</p>
                  <p className="text-lg font-semibold">
                    {isCelsius
                      ? `${current.wind_speed.toFixed(1)} km/h`
                      : `${(current.wind_speed * 0.621371).toFixed(1)} mph`}
                  </p>
                </div>
              </div>
              <div className="w-full">
                <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-center dark:text-gray-100">
                  <WiHumidity size={30} className="mx-auto mb-2" />
                  <p className="text-sm">Humidity</p>
                  <p className="text-lg font-semibold">
                    {current.humidity}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom: Forecast grid */}
          {forecast.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
              {forecast.map((f) => (
                <ForecastCard key={formatDate(f.date)} data={f} isCelsius={isCelsius} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Card className="mt-6 border-destructive">
          <CardContent className="p-4 text-destructive">{error}</CardContent>
        </Card>
      )}
    </div>
  );
}