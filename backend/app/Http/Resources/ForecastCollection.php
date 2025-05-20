<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ForecastCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray($request): array
    {
        // The controller has already filtered and mapped each item to contain
        // 'date', 'temperature', and 'icon' keys.
        return $this->collection->map(fn($item) => [
            'date'        => $item['date'],          
            'temperature' => $item['temperature'],   
            'icon'        => $item['icon'],          
        ])->all();
    }
}
