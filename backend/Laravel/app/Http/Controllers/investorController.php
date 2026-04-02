<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class InvestorController extends Controller
{
    // Fetch approved projects
    public function getApprovedProjects()
    {
        $projects = Project::where('status', 'Approved')->get();

        if ($projects->isEmpty()) {
            return response()->json(['message' => 'No approved projects found.'], 404);
        }

        return response()->json(['projects' => $projects], 200);
    }
}
