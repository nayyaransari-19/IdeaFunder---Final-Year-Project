<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get user settings by email.
     */
    public function getSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid email address.', 'errors' => $validator->errors()], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Prepare user data based on role
        $userData = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
        ];

        if ($user->role === 'Student/Faculty') {
            $userData['student_id'] = $user->student_id;
            $userData['program'] = $user->program;
            $userData['graduation_year'] = $user->graduation_year;
            $userData['campus'] = $user->campus;
        } elseif ($user->role === 'Admin') {
            $userData['admin_id'] = $user->admin_id;
        } elseif ($user->role === 'Investor') {
            $userData['investor_id'] = $user->investor_id;
        }

        return response()->json([
            'message' => 'User settings retrieved successfully.',
            'user' => $userData
        ], 200);
    }

    /**
     * Update user settings.
     */
    public function updateSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'program' => 'nullable|string|max:255',
            'graduation_year' => 'nullable|integer',
            'campus' => 'nullable|string|max:255',
            'password' => 'string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $validator->errors()], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update editable fields
        $user->first_name = $request->input('first_name', $user->first_name);
        $user->last_name = $request->input('last_name', $user->last_name);

        if ($user->role === 'Student/Faculty') {
            $user->program = $request->input('program', $user->program);
            $user->graduation_year = $request->input('graduation_year', $user->graduation_year);
            $user->campus = $request->input('campus', $user->campus);
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        $user->save();

        return response()->json([
            'message' => 'Settings updated successfully.',
            'user' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
            ]
        ], 200);
    }
}
