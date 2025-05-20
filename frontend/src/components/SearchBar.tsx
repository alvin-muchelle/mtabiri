import { useState, FormEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { TempToggle } from './TempToggle';  // import the toggle you made

interface SearchFormProps {
  onSearch: (city: string) => void;
  isCelsius: boolean;
  onToggleTemp: () => void;
  disabledToggle?: boolean;
}

export function SearchBar({ onSearch, isCelsius, onToggleTemp, disabledToggle }: SearchFormProps) {
  const [city, setCity] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city.trim().charAt(0).toUpperCase() + city.slice(1));
    setCity('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Enter city name"
        className="flex-grow"
      />
      <Button type="submit">Search</Button>

      {/* Temperature toggle */}
      <TempToggle
        isCelsius={isCelsius}
        onToggle={onToggleTemp}
        disabled={disabledToggle}
      />
    </form>
  );
}
