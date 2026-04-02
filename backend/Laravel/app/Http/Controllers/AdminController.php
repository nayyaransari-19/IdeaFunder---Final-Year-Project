<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Fetch project statistics and pending projects
    public function getDashboardData()
    {
        $totalProjects = Project::count();
        $pendingProjects = Project::where('status', 'Pending')->count();
        $approvedProjects = Project::where('status', 'Approved')->count();

        $projects = Project::where('status', 'Pending')->get();

        return response()->json([
            'totalProjects' => $totalProjects,
            'pendingProjects' => $pendingProjects,
            'approvedProjects' => $approvedProjects,
            'projects' => $projects
        ], 200);
    }

    // Approve a project
    public function approveProject($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        $project->status = 'Approved';
        $project->save();

        // Create a notification for the student
        Notification::create([
            'student_id' => $project->student_id,
            'type' => 'Approved',
            'message' => "Congratulations! Your project '{$project->title}' has been approved.",
        ]);

        return response()->json(['message' => 'Project approved successfully!']);
    }

    // Reject a project
    public function rejectProject($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        $project->status = 'Rejected';
        $project->save();

        // Create a notification for the student
        Notification::create([
            'student_id' => $project->student_id,
            'type' => 'Rejected',
            'message' => "We're sorry, but your project '{$project->title}' has been rejected.",
        ]);

        return response()->json(['message' => 'Project rejected successfully!']);
    }
}
