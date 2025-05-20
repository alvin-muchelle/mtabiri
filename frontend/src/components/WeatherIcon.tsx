"use client";

interface WeatherIconProps {
  code: string;
  width?: number;
  height?: number;
}

export function WeatherIcon({ code, width = 100, height = 100 }: WeatherIconProps) {
  // OpenWeatherMap icon URL format:

  const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

  return (
    <img 
      src={iconUrl} 
      alt="Weather icon" 
      width={width} 
      height={height} 
      style={{ display: 'block' }} 
      loading="lazy"
    />
  );
}
