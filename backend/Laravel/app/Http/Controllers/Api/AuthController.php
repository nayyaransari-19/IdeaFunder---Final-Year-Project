<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Retrieve the role from the request
        $role = $request->input('role');

        // Common validation rules for all roles
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users|regex:/^[a-zA-Z0-9._%+-]+@szabist\.pk$/',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).*$/',
            ],
        ];
        
        

        // Role-specific validation rules
        switch ($role) {
            case 'Admin':
                $rules['admin_id'] = 'required|digits:7|unique:users';
                break;

            case 'Student/Faculty':
                $rules['student_id'] = 'required|unique:users';
                
                $rules['program'] = 'required|string';
                $rules['graduation_year'] = 'required|integer';
                $rules['campus'] = 'required|string|in:SZABIST Gahro,SZABIST Clifton';
                break;

            case 'Investor':
                $rules['investor_id'] = 'required|unique:users';
                break;

            default:
                return response()->json([
                    'message' => 'Invalid role provided. Valid roles are Admin, Student/Faculty, or Investor.',
                ], 400);
        }

        try {
            // Validate the incoming request data
            $validatedData = $request->validate($rules);

            // Create the user with role-specific attributes
            $user = User::create(array_merge($validatedData, [
                'role' => $role,
                'password' => Hash::make($request->input('password')),
            ]));

            // Respond with a success message and user details
            return response()->json([
                'message' => 'User registered successfully.',
                'user' => $user,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle unexpected errors
            return response()->json([
                'message' => 'An error occurred during registration.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle user login.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validate the incoming login request
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate the user
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            // Return the user's role and a success message
            return response()->json([
                'message' => 'Login successful.',
                'role' => $user->role,
            ], 200);
        }

        // Return an error response for invalid credentials
        return response()->json([
            'message' => 'Invalid email or password.',
        ], 401);
    }
}
