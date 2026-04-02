<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectapproveController extends Controller
{
    // Fetch approved projects
    public function getApprovedProjects()
    {
        $approvedProjects = Project::where('status', 'Approved')->get();
        return response()->json($approvedProjects);
    }
}
