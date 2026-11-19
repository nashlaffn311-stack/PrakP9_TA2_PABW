<?php

namespace Modules\Rute\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RuteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $ruteId = $this->route('rute');

        return [
            'kode_rute' => ['required', 'string', 'max:20', Rule::unique('rutes', 'kode_rute')->ignore($ruteId)],
            'kota_asal' => 'required|string|max:100',
            'kota_tujuan' => 'required|string|max:100',
            'estimasi_waktu' => 'required|string|max:50',
            'harga_tiket' => 'required|integer|min:1000',
            'status_rute' => 'required|in:Aktif,Nonaktif',
        ];
    }
}