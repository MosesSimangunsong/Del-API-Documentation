<?php
namespace App\Http\Controllers;
use App\Models\Project;
use Inertia\Inertia; // <-- PENTING

class ProjectController extends Controller
{
    public function show(Project $project)
    {
        // Ambil semua data terkait proyek ini
        $project->load('folders.endpoints.requestBody'); // Contoh

        // Kirim data ke React menggunakan Inertia::render
        return Inertia::render('ApiTester', [
            'projectData' => $project
        ]);
    }
}