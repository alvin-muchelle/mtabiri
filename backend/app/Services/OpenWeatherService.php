<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenWeatherService
{
    protected string $base;
    protected string $key;
    protected string $defaultUnits;

    public function __construct()
    {
        $this->base         = config('openweather.base');         
        $this->key          = config('openweather.key');          
        $this->defaultUnits = config('openweather.default_units', 'metric');
    }

    /**
     * Fetch current weather by city name.
     * Returns full JSON array with keys: 'weather', 'main', 'wind', etc.
     */
    public function getCurrentByCity(string $city, string $units = null): array
    {
        $units = $units ?? $this->defaultUnits;

        $response = Http::get("{$this->base}/weather", [
            'q'     => $city,
            'appid' => $this->key,
            'units' => $units,
        ]);

        $response->throw();  // will throw if status >= 400

        return $response->json();
    }

    /**
     * Fetch current weather by geographic coordinates.
     */
    public function getCurrentByCoords(float $lat, float $lon, string $units = null): array
    {
        $units = $units ?? $this->defaultUnits;

        $response = Http::get("{$this->base}/weather", [
            'lat'   => $lat,
            'lon'   => $lon,
            'appid' => $this->key,
            'units' => $units,
        ]);

        $response->throw();

        return $response->json();
    }

    /**
     * Fetch full 5-day / 3-hour forecast by city name.
     * Returns the full JSON including 'list'.
     */
    public function getForecastByCity(string $city, string $units = null): array
    {
        $units = $units ?? $this->defaultUnits;

        $response = Http::get("{$this->base}/forecast", [
            'q'     => $city,
            'appid' => $this->key,
            'units' => $units,
        ]);

        $response->throw();

        return $response->json();
    }

    /**
     * Fetch full 5-day / 3-hour forecast by coordinates.
     */
    public function getForecastByCoords(float $lat, float $lon, string $units = null): array
    {
        $units = $units ?? $this->defaultUnits;

        $response = Http::get("{$this->base}/forecast", [
            'lat'   => $lat,
            'lon'   => $lon,
            'appid' => $this->key,
            'units' => $units,
        ]);

        $response->throw();

        return $response->json();
    }
}
