<?php

// app/Http/Controllers/HelpSupportController.php

namespace App\Http\Controllers;

use App\Models\HelpSupport;
use App\Models\HelpSupportReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HelpSupportController extends Controller
{
    // Store a new help issue
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $issue = HelpSupport::create([
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,  // Use the logged-in user's role
        ]);

        return response()->json($issue, 201);
    }

    // Store a reply to an issue
    public function reply(Request $request, $issueId)
    {
        $validated = $request->validate([
            'reply' => 'required|string',
        ]);

        $reply = HelpSupportReply::create([
            'help_support_id' => $issueId,
            'user_id' => Auth::id(),
            'reply' => $validated['reply'],
        ]);

        return response()->json($reply, 201);
    }

    // Fetch issues for the logged-in user (Student or Investor)
    public function fetchUserIssues()
    {
        $issues = HelpSupport::where('user_id', Auth::id())
                             ->with('replies')
                             ->get();

        return response()->json($issues);
    }

    // Admin fetch all issues
    public function fetchAllIssues()
    {
        $issues = HelpSupport::with('replies')->get();

        return response()->json($issues);
    }
}
