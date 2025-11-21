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
        Schema::create('endpoints', function (Blueprint $table) {
            $table->id();
            
            // Matches 'id_folder' in the ERD
            // We make it nullable() to allow endpoints in the project root
            $table->foreignId('folder_id')->nullable()->constrained('folders')->cascadeOnDelete();
            
            $table->string('method');
            
            // Matches 'url' in the ERD, 'path' is a common name
            $table->string('path'); 
            
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('endpoints');
    }
};