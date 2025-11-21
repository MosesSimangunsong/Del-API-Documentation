<?php
namespace App\Http\Controllers;
use App\Models\Endpoint;
use Illuminate\Http\Request;

class EndpointController extends Controller
{
    public function updateBody(Request $request, Endpoint $endpoint)
    {
        // Validasi data
        $validated = $request->validate([
            'body' => 'nullable|string',
        ]);

        // Simpan data body
        // (Asumsi Anda punya relasi 'requestBody')
        $endpoint->requestBody()->updateOrCreate(
            ['endpoint_id' => $endpoint->id],
            ['body_json' => $validated['body']]
        );

        return back(); // Inertia akan otomatis handle
    }
}