'use client';

import React from 'react';
import type { Weather } from '../types/weather';
import { InfoList } from './InfoList';
import Image from 'next/image';

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
    <div className="w-full p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-2 text-center">{data.city}</h2>
      <p className="text-gray-500 mb-4 text-center">{date}</p>

      <div className="flex flex-col items-center gap-4 mb-4">
        <Image
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          width={80}
          height={80}
        />
        <div className="text-center">
          <p className="text-5xl font-bold">{Math.round(data.temperature)}°</p>
          <p className="capitalize">{data.description}</p>
        </div>
      </div>

      <InfoList wind={data.wind_speed} humidity={data.humidity} />
    </div>
  );
};