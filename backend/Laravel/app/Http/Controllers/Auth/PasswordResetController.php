<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller; // Add this line
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use SendinBlue\Client\Api\TransactionalEmailsApi;
use SendinBlue\Client\Configuration;
use GuzzleHttp\Client;

class PasswordResetController extends Controller
{
    public function sendResetCode(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    $token = Str::random(6);

    DB::table('password_resets')->updateOrInsert(
        ['email' => $request->email],
        ['token' => $token, 'created_at' => now()]
    );

    $config = Configuration::getDefaultConfiguration()->setApiKey('api-key', env('BREVO_API_KEY'));
    $apiInstance = new TransactionalEmailsApi(new Client(), $config);

    $emailData = [
        'to' => [['email' => $request->email]],
        'sender' => ['name' => 'Your App Name', 'email' => 'heavengrant31@gmail.com'],
        'subject' => 'Your Password Reset Code',
        'htmlContent' => "<p>Your password reset code is: <strong>{$token}</strong></p>",
    ];

    try {
        \Log::info('Sending reset code to email: ' . $request->email);
        $result = $apiInstance->sendTransacEmail($emailData);
        \Log::info('Brevo Response: ', (array) $result);
        return response()->json(['message' => 'Reset code sent to your email.'], 200);
    } catch (\Exception $e) {
        \Log::error('Failed to send reset code: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to send reset code.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
        ]);

        $record = DB::table('password_resets')->where([
            'email' => $request->email,
            'token' => $request->token,
        ])->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid or expired reset code.'], 400);
        }

        return response()->json(['message' => 'Reset code verified.'], 200);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|confirmed|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $record = DB::table('password_resets')->where([
            'email' => $request->email,
            'token' => $request->token,
        ])->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid or expired reset code.'], 400);
        }

        // Update the user's password
        DB::table('users')->where('email', $request->email)->update([
            'password' => Hash::make($request->password),
        ]);

        // Delete the password reset record
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successful.'], 200);
    }
}
