<?php

namespace Modules\Rute\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Rute\Http\Requests\RuteRequest;
use Modules\Rute\Models\Rute;

class RuteController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $rutes = Rute::when($search, function ($query, $search) {
            $query->where('kode_rute', 'like', "%{$search}%")
                  ->orWhere('kota_asal', 'like', "%{$search}%")
                  ->orWhere('kota_tujuan', 'like', "%{$search}%");
        })->latest()->paginate(5)->withQueryString();

        return Inertia::render('Rute::Index', [
            'rutes' => $rutes,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(RuteRequest $request)
    {
        Rute::create($request->validated());
        return redirect()->back()->with('success', 'Data rute berhasil ditambahkan.');
    }

    public function update(RuteRequest $request, $id)
    {
        $rute = Rute::findOrFail($id);
        $rute->update($request->validated());
        return redirect()->back()->with('success', 'Data rute berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Rute::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data rute berhasil dihapus.');
    }
}