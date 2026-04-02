<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Testimonial;
class TestimonialController extends Controller
{
    // Fetch all testimonials
    public function index()
    {
        return response()->json(Testimonial::all());
    }

    // Store a new testimonial (no validation required)
    public function store(Request $request)
    {
        $testimonial = Testimonial::create($request->all());

        return response()->json(['message' => 'Review added successfully', 'testimonial' => $testimonial], 201);
    }
}