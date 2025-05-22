'use client';

import React from 'react';
import type { Weather } from '../types/weather';
import Image from 'next/image';

interface CurrentWeatherCardProps {
  data: Weather;
  isCelsius: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  isCelsius,
}) => {

  const temp = isCelsius
    ? data.temperature
    : (data.temperature * 9) / 5 + 32;

  const date = new Date(data.date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="px-4 sm:px-0">
      <div className=" bg-white dark:bg-gray-800 text-center dark:text-gray-100 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-2 text-center">{data.city}</h2>
        <p className="bg-white dark:bg-gray-800 dark:text-gray-100  mb-4 text-center">{date}</p>

        <div className="flex flex-col items-center gap-4 mb-4">
          <Image
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            width={100}
            height={100}
          />
          <div className="text-center">
            <p className="text-5xl font-bold">
               {Math.round(temp)}°{isCelsius ? 'C' : 'F'}
            </p>
            <p className="capitalize">{data.description}</p>
          </div>
        </div>
      </div>
    </div>

  );
};