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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            // Foreign key to our local users reference table
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            $table->string('name');
            $table->text('description')->nullable();
            
            // Matches 'status_project' in the ERD
            $table->enum('status', ['private', 'public'])->default('private'); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};