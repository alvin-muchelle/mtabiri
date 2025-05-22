'use client';

import React from 'react';
import Image from 'next/image';
import type { ForecastItem } from '../types/weather';

interface ForecastCardProps {
  data: ForecastItem;
  isCelsius: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  data,
  isCelsius,
}) => {

  const temp = isCelsius
    ? data.temperature
    : (data.temperature * 9) / 5 + 32;

  const date = new Date(data.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800 text-center dark:text-gray-100 flex flex-col items-center">
      <p className="bg-white dark:bg-gray-800 text-center dark:text-gray-100 mb-1">{date}</p>
      <Image
        src={`https://openweathermap.org/img/wn/${data.icon}.png`}
        alt=""
        width={80}
        height={80}
        loading="lazy"
      />
      <p className="text-xl font-medium mt-2">
        {Math.round(temp)}°{isCelsius ? 'C' : 'F'}
      </p>
    </div>
  );
};