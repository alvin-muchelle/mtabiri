<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This file lets you configure CORS for your application. Feel free to
    | adjust the paths, methods and origins to suit your development and
    | production environments.
    |
    */

    // Which routes should accept CORS requests (use wildcard for all api routes)
    'paths' => ['api/*'],

    // Which HTTP methods are allowed
    'allowed_methods' => ['*'],

    // Which origins (domains) may make requests
    'allowed_origins' => [
        'http://localhost:3000', 
    ],

    // Which headers may be sent by the client
    'allowed_headers' => ['*'],

    // Which headers should be exposed back to the client
    'exposed_headers' => [],

    // How long the results of a preflight request can be cached
    'max_age' => 0,

    // Whether to allow credentials (cookies, authorization headers)
    'supports_credentials' => false,

];
