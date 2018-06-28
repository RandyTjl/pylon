<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('web.user.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function test()
    {
        return view('web.user.test');
    }

    public function pylon()
    {
        return view('web.user.pylon');
    }

    //three.js的运用
    public function three()
    {
        return view('web.user.three');
    }

}
