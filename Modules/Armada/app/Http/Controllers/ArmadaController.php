<?php

namespace Modules\Armada\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Modules\Armada\Http\Requests\ArmadaRequest;
use Modules\Armada\Models\Armada;

class ArmadaController extends Controller
{
    public function index()
    {
        return Inertia::render('Armada::Index');
    }

    public function listData()
    {
        return response()->json([
            'data' => Armada::latest()->get(),
        ]);
    }

    public function store(ArmadaRequest $request)
    {
        $validated = $request->validated();
        $validated['foto_armada'] = $request->file('foto_armada')->store('armada', 'public');

        $armada = Armada::create($validated);

        return response()->json([
            'message' => 'Data armada berhasil ditambahkan.',
            'data' => $armada,
        ], 201);
    }

    public function update(ArmadaRequest $request, $id)
    {
        $armada = Armada::findOrFail($id);
        $validated = $request->validated();

        if ($request->hasFile('foto_armada')) {
            if ($armada->foto_armada && Storage::disk('public')->exists($armada->foto_armada)) {
                Storage::disk('public')->delete($armada->foto_armada);
            }
            $validated['foto_armada'] = $request->file('foto_armada')->store('armada', 'public');
        } else {
            unset($validated['foto_armada']);
        }

        $armada->update($validated);

        return response()->json([
            'message' => 'Data armada berhasil diperbarui.',
            'data' => $armada,
        ]);
    }

    public function destroy($id)
    {
        $armada = Armada::findOrFail($id);

        if ($armada->foto_armada && Storage::disk('public')->exists($armada->foto_armada)) {
            Storage::disk('public')->delete($armada->foto_armada);
        }

        $armada->delete();

        return response()->json([
            'message' => 'Data armada dan berkas berhasil dihapus.',
        ]);
    }
}