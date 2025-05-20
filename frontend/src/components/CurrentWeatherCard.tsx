import React from 'react';
import type { Weather } from '../types/weather';
import { InfoList } from './InfoList';

interface CurrentWeatherCardProps {
  data: Weather;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data }) => {
  const date = new Date(data.date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-2">{data.city}</h2>
      <p className="text-gray-500 mb-4">{date}</p>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-20 h-20"
        />
        <div>
          <p className="text-5xl font-bold">{Math.round(data.temperature)}°</p>
          <p className="capitalize">{data.description}</p>
        </div>
      </div>

      <InfoList wind={data.wind_speed} humidity={data.humidity} />
    </div>
  );
};
