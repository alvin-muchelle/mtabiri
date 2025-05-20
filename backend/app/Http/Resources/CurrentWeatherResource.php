<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CurrentWeatherResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'city'        => $this->resource['name'] ?? null,
            'temperature' => $this->resource['main']['temp'] ?? null,
            'humidity'    => $this->resource['main']['humidity'] ?? null,
            'description' => $this->resource['weather'][0]['description'] ?? null,
            'icon'        => $this->resource['weather'][0]['icon'] ?? null,
            'wind_speed'  => $this->resource['wind']['speed'] ?? null,
            'date' => Carbon::now('Africa/Nairobi')->toDateTimeLocalString(),

        ];
    }
}
