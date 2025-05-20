<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;

class WeatherApiTest extends TestCase
{
    public function test_current_endpoint_returns_proper_structure()
    {
        Http::fake([
            'api.openweathermap.org/*' => Http::response([
                'name' => 'Nairobi',
                'main' => ['temp' => 20, 'humidity' => 50],
                'weather' => [['description'=>'clear','icon'=>'01d']],
                'wind' => ['speed'=>3.5],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/weather/current?city=Nairobi');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'city','temperature','humidity','description','icon','wind_speed'
                     ],
                 ]);
    }
}
