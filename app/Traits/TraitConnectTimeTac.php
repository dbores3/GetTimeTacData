<?php
namespace App\Traits;

use kamermans\OAuth2\GrantType\PasswordCredentials;
use kamermans\OAuth2\OAuth2Middleware;
use GuzzleHttp\HandlerStack;

trait TraitConnectTimeTac{
    
    // @desc    Connects to the Time Tac's API & gets all the users
    // @access  Public
    public function connectTimeTacAPI(){
        // Authorization client - this is used to request OAuth access tokens
        $reauth_client = new \GuzzleHttp\Client([
            // URL for access_token request
            'base_uri' => 'https://go-sandbox.timetac.com/interview/auth/oauth2/token',
        ]);
        
        //credentials
        $reauth_config = [
            'username' => config('app.TT_USER'),
            'password' => config('app.TT_PASSWORD'),
            'client_id' => config('app.TT_CLIENT_ID'),
            'client_secret' => config('app.TT_CLIENT_SECRET'),
        ];
        
        //Authentication with password & OAUTH 2
        $grant_type = new PasswordCredentials($reauth_client, $reauth_config);
        $oauth = new OAuth2Middleware($grant_type);

        $stack = HandlerStack::create();
        $stack->push($oauth);

        // This is the normal Guzzle client to be used in the app
        $client = new \GuzzleHttp\Client([
            'handler' => $stack,
            'auth'    => 'oauth',
        ]);

        //Requests all the users
        $response = $client->get('https://go-sandbox.timetac.com/interview/userapi/v3/users/read');

        //Decodes the json, so it can get the results
        $users = json_decode($response->getBody(),true);
        $users = $users['Results'];

        return $users;
    }

}// end trait
