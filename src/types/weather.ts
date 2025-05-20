export interface Geocode {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export interface Weather {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  wind_speed: number;
  humidity: number;
  date: string;
}

export interface ForecastItem {
  date: string;
  temperature: number;
  icon: string;
}
