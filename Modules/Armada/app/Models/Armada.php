<?php

namespace Modules\Armada\Models;

use Illuminate\Database\Eloquent\Model;

class Armada extends Model
{
    protected $fillable = [
        'nomor_polisi',
        'nama_po',
        'kelas_bus',
        'kapasitas_kursi',
        'status_operasi',
        'foto_armada',
    ];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute(): string
    {
        return asset('storage/' . $this->foto_armada);
    }
}