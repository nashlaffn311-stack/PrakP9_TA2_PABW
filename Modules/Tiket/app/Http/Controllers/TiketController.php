<?php

namespace Modules\Tiket\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Modules\Rute\Models\Rute;
use Modules\Tiket\Http\Requests\TiketRequest;
use Modules\Tiket\Models\Tiket;

class TiketController extends Controller
{
    public function index()
    {
        return Inertia::render('Tiket::Index', [
            'ruteOptions' => Rute::where('status_rute', 'Aktif')->get(),
        ]);
    }

    public function listData()
    {
        $query = Tiket::latest();

        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function store(TiketRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();
        $validated['bukti_bayar'] = $request->file('bukti_bayar')->store('tiket', 'public');

        $tiket = Tiket::create($validated);

        return response()->json([
            'message' => 'Pemesanan tiket berhasil disimpan.',
            'data' => $tiket,
        ], 201);
    }

    public function update(TiketRequest $request, $id)
    {
        $tiket = Tiket::findOrFail($id);

        if (Auth::user()->role !== 'admin' && $tiket->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak mengubah tiket pengguna lain.');
        }

        $validated = $request->validated();

        if ($request->hasFile('bukti_bayar')) {
            if ($tiket->bukti_bayar && Storage::disk('public')->exists($tiket->bukti_bayar)) {
                Storage::disk('public')->delete($tiket->bukti_bayar);
            }
            $validated['bukti_bayar'] = $request->file('bukti_bayar')->store('tiket', 'public');
        } else {
            unset($validated['bukti_bayar']);
        }

        $tiket->update($validated);

        return response()->json([
            'message' => 'Data pemesanan tiket berhasil diperbarui.',
            'data' => $tiket,
        ]);
    }

    public function destroy($id)
    {
        $tiket = Tiket::findOrFail($id);

        if (Auth::user()->role !== 'admin' && $tiket->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak menghapus tiket pengguna lain.');
        }

        if ($tiket->bukti_bayar && Storage::disk('public')->exists($tiket->bukti_bayar)) {
            Storage::disk('public')->delete($tiket->bukti_bayar);
        }

        $tiket->delete();

        return response()->json([
            'message' => 'Pemesanan tiket dan bukti pembayaran berhasil dihapus.',
        ]);
    }
}