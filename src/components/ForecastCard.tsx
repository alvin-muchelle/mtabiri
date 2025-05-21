'use client'

import React from 'react';
import Image from 'next/image';
import type { ForecastItem } from '../types/weather';

interface ForecastCardProps {
  data: ForecastItem;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ data }) => {
  const date = new Date(data.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="p-4 rounded-2xl shadow bg-white flex flex-col items-center">
      <p className="text-gray-600 mb-1">{date}</p>
      <Image
        src={`https://openweathermap.org/img/wn/${data.icon}.png`}
        alt=""
        className="w-12 h-12 mb-1"
      />
      <p className="text-xl font-medium">{Math.round(data.temperature)}°</p>
    </div>
  );
};
