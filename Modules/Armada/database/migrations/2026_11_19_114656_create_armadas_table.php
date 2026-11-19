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
        Schema::create('armadas', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_polisi');
            $table->string('nama_po');
            $table->enum('kelas_bus', ['Ekonomi', 'Bisnis', 'Eksekutif']);
            $table->integer('kapasitas_kursi');
            $table->enum('status_operasi', ['Beroperasi', 'Perawatan'])->default('Beroperasi');
            $table->string('foto_armada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('armadas');
    }
};
