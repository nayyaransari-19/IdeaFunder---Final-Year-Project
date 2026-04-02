<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProjectSubController extends Controller
{
    public function submitProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:users,student_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'features' => '|string',
            'problem_statement' => '|string',
            'solution_statement' => '|string',
            'keywords' => '|string|regex:/^[a-zA-Z0-9, ]+$/',
            'deployment_time' => '|integer',
            'supervisor' => '|string|max:255',
            'technologies_used' => '|string|regex:/^[a-zA-Z0-9, ]+$/',
            'required_resources' => '|string',
            'proposed_budget' => '|numeric',
            'srs_document' => '|file|mimes:pdf|max:20488',
            'ui_ux_preview' => '|file|mimes:jpg,png,jpeg|max:2048',
            'additional_files' => '|file|mimes:zip,rar|max:51200',
            'presentation_proposal' => '|file|mimes:ppt,pptx|max:20488',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed!',
                'errors' => $validator->errors()
            ], 422);
        }
        

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Handle file uploads
        foreach (['srs_document', 'ui_ux_preview', 'additional_files', 'presentation_proposal'] as $fileField) {
            if ($request->hasFile($fileField)) {
                $data[$fileField] = $request->file($fileField)->store('uploads', 'public');
            }
        }

        try {
            $project = Project::create($data);

            return response()->json([
                'message' => 'Project submitted successfully!',
                'project' => $this->formatProjectResponse($project),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error submitting project.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        return response()->json([
            'message' => 'Project details retrieved successfully!',
            'project' => $this->formatProjectResponse($project),
        ]);
    }

    public function index(Request $request)
    {
        try {
            $studentId = $request->query('student_id');

            if (!$studentId) {
                return response()->json(['message' => 'Student ID is required.'], 400);
            }

            $projects = Project::where('student_id', $studentId)->get();

            return response()->json([
                'projects' => $projects->map(fn($project) => $this->formatProjectResponse($project)),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching projects.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getProjectsByEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $projects = Project::where('student_id', $user->student_id)->get();

        return response()->json([
            'projects' => $projects->map(fn($project) => $this->formatProjectResponse($project)),
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'features' => '|string',
            'problem_statement' => '|string',
            'solution_statement' => '|string',
            'keywords' => '|string',
            'deployment_time' => '|integer',
            'supervisor' => '|string|max:255',
            'technologies_used' => '|string',
            'required_resources' => '|string',
            'proposed_budget' => '|numeric',
            'srs_document' => '|file|mimes:pdf|max:2048',
            'ui_ux_preview' => '|file|mimes:jpg,png,jpeg|max:2048',
            'additional_files' => '|file|mimes:zip,rar|max:5120',
            'presentation_proposal' => '|file|mimes:pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle file updates
        foreach (['srs_document', 'ui_ux_preview', 'additional_files', 'presentation_proposal'] as $fileField) {
            if ($request->hasFile($fileField)) {
                Storage::disk('public')->delete($project->$fileField); // Delete old file
                $project->$fileField = $request->file($fileField)->store('uploads', 'public');
            }
        }

        $project->update($request->except(['srs_document', 'ui_ux_preview', 'additional_files', 'presentation_proposal']));

        return response()->json([
            'message' => 'Project updated successfully!',
            'project' => $this->formatProjectResponse($project),
        ], 200);
    }

    private function formatProjectResponse($project)
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'category' => $project->category,
            'features' => $project->features,
            'problem_statement' => $project->problem_statement,
            'solution_statement' => $project->solution_statement,
            'keywords' => $project->keywords,
            'deployment_time' => $project->deployment_time,
            'supervisor' => $project->supervisor,
            'technologies_used' => $project->technologies_used,
            'required_resources' => $project->required_resources,
            'proposed_budget' => $project->proposed_budget,
            'student_id' => $project->student_id,
            'srs_document_url' => $project->srs_document ? asset('storage/' . $project->srs_document) : null,
            'ui_ux_preview_url' => $project->ui_ux_preview ? asset('storage/' . $project->ui_ux_preview) : null,
            'additional_files_url' => $project->additional_files ? asset('storage/' . $project->additional_files) : null,
            'presentation_proposal_url' => $project->presentation_proposal ? asset('storage/' . $project->presentation_proposal) : null,
            'status' => $project->status,
            'created_at' => $project->created_at,
            'updated_at' => $project->updated_at,
        ];
    }
}
