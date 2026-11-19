<?php

namespace Modules\Tiket\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TiketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch') || $this->input('_method') === 'PUT';

        return [
            'nama_penumpang' => 'required|string|max:100',
            'rute_perjalanan' => 'required|string|max:150',
            'tanggal_berangkat' => 'required|date',
            'jumlah_tiket' => 'required|integer|min:1|max:10',
            'bukti_bayar' => ($isUpdate ? 'nullable' : 'required') . '|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];
    }
}