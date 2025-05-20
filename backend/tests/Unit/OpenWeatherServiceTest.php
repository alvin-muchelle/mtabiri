<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\OpenWeatherService;
use Illuminate\Support\Facades\Http;

class OpenWeatherServiceTest extends TestCase
{
    public function test_current_weather_fetches_and_parses_json()
    {
        Http::fake([
            'api.openweathermap.org/*' => Http::response([
                'name' => 'Nairobi',
                'main' => ['temp' => 20, 'humidity' => 50],
                'weather' => [['description'=>'clear','icon'=>'01d']],
                'wind' => ['speed'=>3.5],
            ], 200),
        ]);

        $service = new OpenWeatherService();
        $data    = $service->current('Nairobi', 'metric');

        $this->assertEquals('Nairobi', $data['name']);
        $this->assertEquals(20, $data['main']['temp']);
    }
}
