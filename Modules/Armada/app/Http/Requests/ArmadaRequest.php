<?php

namespace Modules\Armada\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArmadaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch') || $this->input('_method') === 'PUT';

        return [
            'nomor_polisi' => 'required|string|max:20',
            'nama_po' => 'required|string|max:100',
            'kelas_bus' => 'required|in:Ekonomi,Bisnis,Eksekutif',
            'kapasitas_kursi' => 'required|integer|min:10|max:80',
            'status_operasi' => 'required|in:Beroperasi,Perawatan',
            'foto_armada' => ($isUpdate ? 'nullable' : 'required') . '|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];
    }
}