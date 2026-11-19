<?php

namespace Modules\Tiket\Models;

use Illuminate\Database\Eloquent\Model;

class Tiket extends Model
{
    protected $fillable = [
        'user_id',
        'nama_penumpang',
        'rute_perjalanan',
        'tanggal_berangkat',
        'jumlah_tiket',
        'bukti_bayar',
    ];

    protected $appends = ['bukti_url'];

    public function getBuktiUrlAttribute(): string
    {
        return asset('storage/' . $this->bukti_bayar);
    }
}