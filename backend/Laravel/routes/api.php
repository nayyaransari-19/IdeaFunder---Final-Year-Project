<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth-related controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\ProjectSubController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\InvestorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectapproveController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectManagementController;
use App\Http\Controllers\TestimonialController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetCode']);
Route::post('/verify-reset-code', [PasswordResetController::class, 'verifyResetCode']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
// Fetch project by ID
Route::get('/projects/{id}', [ProjectSubController::class, 'show']);
Route::put('/projects/{id}', [ProjectSubController::class, 'update']);

// Student Project Routes
Route::post('/student/project/submit', [ProjectSubController::class, 'submitProject']);
Route::get('/student/projects', [ProjectSubController::class, 'getProjectsByEmail']);
Route::get('/student/project/{id}', [ProjectSubController::class, 'show']);
Route::put('/student/project/{id}', [ProjectSubController::class, 'update']);

// Admin Routes
Route::get('/admin/dashboard', [AdminController::class, 'getDashboardData']);
Route::get('/admin/projects/pending', [AdminController::class, 'getPendingProjects']);
Route::put('/admin/projects/{id}/approve', [AdminController::class, 'approveProject']);
Route::put('/admin/projects/{id}/reject', [AdminController::class, 'rejectProject']);

// Notifications
Route::get('/student/notifications', [NotificationController::class, 'getNotifications']);

// Investor Routes
Route::get('/investor/approved-projects', [InvestorController::class, 'getApprovedProjects']);

// Profile Routes
Route::post('/student/profile/save', [ProfileController::class, 'saveProfile']);
Route::get('/student/profile/get-id', [ProfileController::class, 'getStudentId']);
Route::get('/student/profile/preview', [ProfileController::class, 'getProfilePreview']);

// Profile Routes (auto-detect student ID via session)
Route::get('/student/profile', [ProfileController::class, 'getProfile']);
Route::post('/student/profile/save', [ProfileController::class, 'saveProfile']);
Route::get('/student/profile/get-id', [ProfileController::class, 'getStudentByEmail']);


// Approved Projects
Route::get('/approved-projects', [ProjectapproveController::class, 'getApprovedProjects']);

// User Management
Route::get('/users', [UserController::class, 'getUsers']);
Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
Route::put('/users/{id}', [UserController::class, 'updateUser']);

// Project Management


Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectManagementController::class, 'getAllProjects']);
    Route::delete('/{id}', [ProjectManagementController::class, 'deleteProject']);
});



use App\Http\Controllers\SettingsController;

Route::get('/user/settings', [SettingsController::class, 'getSettings']);
Route::post('/user/settings/update', [SettingsController::class, 'updateSettings']);


Route::get('/testimonials', [TestimonialController::class,'index']);
Route::post('/testimonials', [TestimonialController::class,'store']);

use App\Http\Controllers\EditProjectController;

Route::get('/projects/{id}', [EditProjectController::class, 'show']);
Route::post('/projects/update/{id}', [EditProjectController::class, 'update']);
Route::delete('/projects/delete-file/{id}/{fileField}', [EditProjectController::class, 'deleteFile']);

use App\Http\Controllers\Api\StudentController;

Route::get('/student/name', [StudentController::class, 'getStudentName']);
// routes/api.php
