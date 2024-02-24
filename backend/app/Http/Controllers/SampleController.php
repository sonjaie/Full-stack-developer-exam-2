<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sample;

class SampleController extends Controller
{
    public function index()
    {
        $samples = Sample::all();
        return response()->json($samples);
    }
}
