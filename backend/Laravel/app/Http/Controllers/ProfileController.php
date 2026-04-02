<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function saveProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'skills' => 'string|max:255',
            'introduction' => 'string|max:500',
            'past_experience' => 'string|max:500',
            'dedication' => 'string|max:500',
            'future_goals' => 'string|max:500',
            'profile_picture' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $data = $request->all();
        $data['student_id'] = $user->student_id;

        if ($request->hasFile('profile_picture')) {
            $data['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $profile = StudentProfile::updateOrCreate(
            ['student_id' => $data['student_id']],
            $data
        );

        return response()->json([
            'message' => 'Profile saved successfully!',
            'profile' => $profile,
        ], 201);
    }

    public function getProfilePreview(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $profile = StudentProfile::where('student_id', $user->student_id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return response()->json([
            'profile' => [
                'student_id' => $user->student_id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'department' => $user->department ?? 'Not Available',
                'program' => $user->program ?? 'Not Available',
                'graduation_year' => $user->graduation_year ?? 'Not Available',
                'campus' => $user->campus ?? 'Not Available',
                'skills' => $profile->skills,
                'introduction' => $profile->introduction,
                'past_experience' => $profile->past_experience,
                'dedication' => $profile->dedication,
                'future_goals' => $profile->future_goals,
                'profile_picture' => $profile->profile_picture,
            ]
        ], 200);
    }
    public function getStudentByEmail(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    return response()->json([
        'student_id' => $user->student_id,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
    ], 200);
}

}
