<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Users\UsersController;
use App\Http\Controllers\Users\ExportController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route to check all the users
Route::get('/', [UsersController::class, 'getUsers']);

//Route to export the users in a CSV file
Route::get('/exportCSV', [ExportController::class, 'exportCSV']);

//Route to export the users in a JSON file
Route::get('/exportJSON', [ExportController::class, 'exportJSON']);

//Route to export the users in a HTML file
Route::get('/exportHTML', [ExportController::class, 'exportHTML']);

