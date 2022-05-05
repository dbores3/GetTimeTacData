<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//Trait for connecting to the Time Tac's API
use App\Traits\TraitConnectTimeTac;

class UsersController extends Controller
{
    //calls the Trait
    use TraitConnectTimeTac;

    // @desc    Gets all the users from the Time Tac's API &
    //          prints them in a table
    // @route   GET /
    // @access  Public
    public function getUsers(){
        //Gets all the users from the API
        $users = $this->connectTimeTacAPI();
        
        return view('usersTable', compact('users'));
    }
    
}
