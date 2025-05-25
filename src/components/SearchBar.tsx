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

  // A ref that, when set to true, tells us to skip opening the dropdown
  // on the *next* query‐update cycle:
  const justSelectedRef = useRef(false);

  useEffect(() => {
    // If we just came from a click/select, skip this effect once:
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Phase 1: try Kenyan query first
        let candidates = await fetchGeocode(`${query},KE`, 1);
        // If no Kenyan results, fallback globally:
        if (!candidates.length) {
          candidates = await fetchGeocode(query, 5);
        }
        setResults(candidates);
        if (candidates.length > 0) {
          setShowDropdown(true);
        }
      } catch {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside:
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
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the city name"
            className="w-full text-sm sm:text-base"
            onFocus={() => {
              if (results.length > 0) {
                setShowDropdown(true);
              }
            }}
          />
        </div>

        <Button
          className="sm:w-auto"
          onClick={() => {
            if (results.length === 0) return;
            const top = results[0];
            // Tell the effect to skip reopening on next query change:
            justSelectedRef.current = true;
            setShowDropdown(false);
            setResults([]);
            setQuery(top.name);
            onSelect({ name: top.name, lat: top.lat, lon: top.lon });
          }}
          disabled={results.length === 0}
        >
          Search
        </Button>
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow">
          {results.map((loc, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => {
                // We just clicked on a dropdown item:
                justSelectedRef.current = true;
                setShowDropdown(false);
                setResults([]);
                setQuery(loc.name);
                onSelect({ name: loc.name, lat: loc.lat, lon: loc.lon });
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
