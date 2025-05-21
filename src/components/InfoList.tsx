"use client"

interface Props {
  wind: number;
  humidity: number;
}

export function InfoList({ wind, humidity }: Props) {
  return (
    <ul className="space-y-1">
      <li>Wind: {wind} m/s</li>
      <li>Humidity: {humidity}%</li>
    </ul>
  );
}
