<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('request_bodies', function (Blueprint $table) {
            $table->id();
            // Matches 'id_endpoint' in the ERD
            $table->foreignId('endpoint_id')->constrained('endpoints')->cascadeOnDelete();
            
            $table->string('content_type')->default('application/json');
            
            // Stores the JSON body content
            $table->json('body')->nullable(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_bodies');
    }
};