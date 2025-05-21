"use client"

import { Button } from './ui/button';

interface TempToggleProps {
  isCelsius: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function TempToggle({ isCelsius, onToggle, disabled }: TempToggleProps) {
  return (
    <div className="inline-flex rounded-md border bg-background p-1">
      <Button
        variant={isCelsius ? 'default' : 'ghost'}
        size="sm"
        onClick={() => !isCelsius && onToggle()}
        disabled={disabled}
      >
        °C
      </Button>
      <Button
        variant={!isCelsius ? 'default' : 'ghost'}
        size="sm"
        onClick={() => isCelsius && onToggle()}
        disabled={disabled}
      >
        °F
      </Button>
    </div>
  );
}
