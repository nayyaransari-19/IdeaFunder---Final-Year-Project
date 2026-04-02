<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'features',
        'problem_statement',
        'solution_statement',
        'keywords',
        'deployment_time',
        'supervisor',
        'technologies_used',
        'required_resources',
        'proposed_budget',
        'status',
        'student_id',
        'srs_document',
        'ui_ux_preview',
        'additional_files',
    'presentation_proposal',
    ];
    public function images()
{
    return $this->hasMany(Image::class);
}

}
