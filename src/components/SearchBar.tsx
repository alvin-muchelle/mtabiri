// src/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchGeocode, GeocodeResult } from '@/lib/weatherApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface SearchBarProps {
  onSelect: (loc: { name: string; lat: number; lon: number }) => void;
  isCelsius: boolean;
  onToggleTemp: () => void;
  disabledToggle: boolean;
}

export function SearchBar({
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        // Phase 1: try Kenya only
        let candidates = await fetchGeocode(`${query},KE`, 1);
        // Phase 2: fallback to global if no Kenyan hits
        if (!candidates.length) {
          candidates = await fetchGeocode(query, 5);
        }
        setResults(candidates);
        setShowDropdown(true);
      } catch {
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Input field */}
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the city name"
              className="flex-1 text-sm sm:text-base"
              onFocus={() => results.length > 0 && setShowDropdown(true)}
            />

            {/* Combined button and toggle container */}
            <div className="flex items-center gap-2 sm:w-auto">

              {/* Search Button */}
              <Button
                className="sm:w-auto flex-1"
                onClick={() => {
                  const top = results[0];
                  onSelect({ name: top.name, lat: top.lat, lon: top.lon });
                  setShowDropdown(false);
                  setQuery(top.name);
                }}
                disabled={results.length === 0}
              >
                Search
              </Button>
              
            </div>
          </div>
        </div>
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow">
          {results.map((loc, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => {
                onSelect({ name: loc.name, lat: loc.lat, lon: loc.lon });
                setShowDropdown(false);
                setQuery(loc.name);
              }}
            >
              {loc.name}
              {loc.state ? `, ${loc.state}` : ''}, {loc.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
