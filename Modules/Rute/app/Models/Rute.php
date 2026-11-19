<?php

namespace Modules\Rute\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Rute\Database\Factories\RuteFactory;

class Rute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'kode_rute',
        'kota_asal',
        'kota_tujuan',
        'estimasi_waktu',
        'harga_tiket',
        'status_rute',
    ];

    // protected static function newFactory(): RuteFactory
    // {
    //     // return RuteFactory::new();
    // }
}
