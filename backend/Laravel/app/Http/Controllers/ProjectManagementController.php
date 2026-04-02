<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectManagementController extends Controller
{
    // Fetch all projects
    public function getAllProjects()
    {
        $projects = Project::all();
        return response()->json($projects);
    }

    // Delete a project by ID
    public function deleteProject($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();
        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}

