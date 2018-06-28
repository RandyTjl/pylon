<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware'=>['web'],'namespace'=>'web'],function (){
    Route::get('/user',"UserController@index" );
    Route::get('/user/test',"UserController@test" );
    Route::get('/user/pylon',"UserController@pylon" );
    Route::get('/user/three',"UserController@three" );
});