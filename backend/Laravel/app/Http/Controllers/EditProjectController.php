<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EditProjectController extends Controller
{
    // Get Project Details
    public function show($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json([
            'message' => 'Project details retrieved successfully!',
            'project' => $this->formatProjectResponse($project),
        ]);
    }

    // Update Project Details
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
            'features' => 'nullable|string',
            'problem_statement' => 'nullable|string',
            'solution_statement' => 'nullable|string',
            'keywords' => 'nullable|string',
            'deployment_time' => 'nullable|integer',
            'supervisor' => 'nullable|string|max:255',
            'technologies_used' => 'nullable|string',
            'required_resources' => 'nullable|string',
            'proposed_budget' => 'nullable|numeric',
            'srs_document' => 'nullable|file|mimes:pdf|max:2048',
            'ui_ux_preview' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'additional_files' => 'nullable|file|mimes:zip,rar|max:5120',
            'presentation_proposal' => 'nullable|file|mimes:pptx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle file updates
        foreach (['srs_document', 'ui_ux_preview', 'additional_files', 'presentation_proposal'] as $fileField) {
            if ($request->hasFile($fileField)) {
                if ($project->$fileField) {
                    Storage::disk('public')->delete($project->$fileField);
                }
                $project->$fileField = $request->file($fileField)->store('uploads', 'public');
            }
        }

        $project->update($request->except(['srs_document', 'ui_ux_preview', 'additional_files', 'presentation_proposal']));

        return response()->json([
            'message' => 'Project updated successfully!',
            'project' => $this->formatProjectResponse($project),
        ], 200);
    }

    // Delete Specific File
    public function deleteFile($id, $fileField)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $allowedFields = ['srs_document', 'ui_ux_preview', 'additional_files', 'presentation_proposal'];

        if (!in_array($fileField, $allowedFields)) {
            return response()->json(['message' => 'Invalid file field'], 400);
        }

        if ($project->$fileField) {
            Storage::disk('public')->delete($project->$fileField);
            $project->$fileField = null;
            $project->save();
        }

        return response()->json(['message' => 'File deleted successfully'], 200);
    }

    // Format Response
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
