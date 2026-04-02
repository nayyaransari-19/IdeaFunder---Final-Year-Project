<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Notifications\ResetPassword;
class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'first_name',
    'last_name',
    'email',
    'password',
    'role',
    'admin_id',
    'student_id',
    'department',
    'program',
    'graduation_year',
    'campus',
    'investor_id',
    ];
    
    public function sendPasswordResetNotification($token)
    {
        $url = env('http://localhost:3000') . '/reset-password?token=' . $token;
    
        $this->notify(new ResetPassword($url));
    }
    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
}
