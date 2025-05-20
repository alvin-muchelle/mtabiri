<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WeatherRequest;
use App\Http\Resources\CurrentWeatherResource;
use App\Http\Resources\ForecastCollection;
use App\Services\OpenWeatherService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Arr;
use Carbon\Carbon;

class WeatherController extends Controller
{
    public function __construct(private OpenWeatherService $owm) {}

    /**
     * GET /api/v1/weather/current
     * Branches on city vs. lat/lon as before.
     */
    public function current(WeatherRequest $request)
    {
        $units = $request->input('units', config('openweather.default_units'));

        if ($request->has(['lat','lon'])) {
            $lat      = (float)$request->lat;
            $lon      = (float)$request->lon;
            $cacheKey = "weather:current:coords:{$lat}:{$lon}:{$units}";
            $fetch    = fn() => $this->owm->getCurrentByCoords($lat, $lon, $units);
        } else {
            $city     = $request->input('city', config('openweather.default_city'));
            $cacheKey = "weather:current:city:{$city}:{$units}";
            $fetch    = fn() => $this->owm->getCurrentByCity($city, $units);
        }

        try {
            $payload = Cache::remember($cacheKey, now()->addMinutes(10), $fetch);
            return (new CurrentWeatherResource($payload))
                   ->response()
                   ->setStatusCode(Response::HTTP_OK);
        } catch (\Throwable $e) {
            throw new HttpResponseException(
                response()->json(['error' => 'Unable to fetch current weather.'], Response::HTTP_BAD_GATEWAY)
            );
        }
    }

    /**
     * GET /api/v1/weather/forecast
     * Only return 3 snapshots at 09:00:00 for the next three days.
     */
   
    public function forecast(WeatherRequest $request)
    {
        $units = $request->input('units', config('openweather.default_units'));

        if ($request->has(['lat','lon'])) {
            $lat      = (float)$request->lat;
            $lon      = (float)$request->lon;
            $cacheKey = "weather:forecast:coords:{$lat}:{$lon}:{$units}";
            $fetch    = fn() => $this->owm->getForecastByCoords($lat, $lon, $units);
        } else {
            $city     = $request->input('city', config('openweather.default_city'));
            $cacheKey = "weather:forecast:city:{$city}:{$units}";
            $fetch    = fn() => $this->owm->getForecastByCity($city, $units);
        }

        try {
            $payload = Cache::remember($cacheKey, now()->addMinutes(10), $fetch);
            
            $list = Arr::get($payload, 'list', []);

            // Safely map the data with proper error handling
            $mapped = collect($list)->map(function ($item) {
                $dt = Arr::get($item, 'dt', 0);
                $date = Carbon::createFromTimestampUTC($dt)->setTimezone('Africa/Nairobi');
                return [
                    'date'        =>  $date->format('Y-m-d H:i:s'),
                    'temperature' => Arr::get($item, 'main.temp', 'N/A'),
                    'icon'        => Arr::get($item, 'weather.0.icon', ''),
                ];
            });

            // Filter out invalid entries (where dt was 0)
            $validEntries = $mapped->filter(fn($item) => $item['date'] !== '1970-01-01 00:00:00');

            $today = now()->toDateString();

            $threeDays = $validEntries
                ->filter(function ($item) use ($today) {
                    $date = substr($item['date'], 0, 10);
                    $time = substr($item['date'], 11); // HH:MM:SS
                    return $date > $today && $time === '09:00:00';
                })
                ->take(3)
                ->values()
                ->all();

            return (new ForecastCollection($threeDays))
                ->response()
                ->setStatusCode(Response::HTTP_OK);

        } catch (\Throwable $e) {
            \Log::error('Forecast error: '.$e->getMessage(), ['trace' => $e->getTrace()]);
            throw new HttpResponseException(
                response()->json(['error' => 'Unable to fetch forecast.'], Response::HTTP_BAD_GATEWAY)
            );
        }
    }
}
