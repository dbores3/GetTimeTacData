<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */

    // @desc Tests the route to download the CSV file
    public function testUserRoute(){
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    // @desc Tests if the user's view is receiving the user
    public function testUserHasData(){
        $response = $this->get('/');
        
        $response->assertViewHas([
            'users',
        ]);
    }

    // @desc Tests if the user's view the route to download the CSV file
    public function testUserCheckCorrectView(){
        $response = $this->get('/');
        $response->assertViewIs('usersTable');

    }

}
