import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function TiketIndex({ ruteOptions = [] }: { ruteOptions?: any[] }) {
    const { auth }: any = usePage().props;
    const [items, setItems] = useState<any[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [oldBuktiUrl, setOldBuktiUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [message, setMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({
        nama_penumpang: auth?.user?.name || '',
        rute_perjalanan: '',
        tanggal_berangkat: '',
        jumlah_tiket: '1',
    });
    const [buktiBayar, setBuktiBayar] = useState<File | null>(null);

    const getCsrf = () =>
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const fetchData = async () => {
        const res = await fetch('/tiket/data', { headers: { Accept: 'application/json' } });
        const json = await res.json();
        setItems(json.data || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setEditId(null);
        setOldBuktiUrl(null);
        setErrors({});
        setForm({
            nama_penumpang: auth?.user?.name || '',
            rute_perjalanan: '',
            tanggal_berangkat: '',
            jumlah_tiket: '1',
        });
        setBuktiBayar(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setMessage(null);

        const fd = new FormData();
        fd.append('nama_penumpang', form.nama_penumpang);
        fd.append('rute_perjalanan', form.rute_perjalanan);
        fd.append('tanggal_berangkat', form.tanggal_berangkat);
        fd.append('jumlah_tiket', form.jumlah_tiket);
        if (buktiBayar) fd.append('bukti_bayar', buktiBayar);

        const url = editId ? `/tiket/${editId}` : '/tiket';
        if (editId) fd.append('_method', 'PUT');

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCsrf(),
            },
            body: fd,
        });

        const json = await res.json();

        if (!res.ok) {
            if (res.status === 422 && json.errors) {
                setErrors(json.errors);
            }
            return;
        }

        setMessage(json.message);
        resetForm();
        fetchData();
    };

    const handleEdit = (item: any) => {
        setEditId(item.id);
        setOldBuktiUrl(item.bukti_url);
        setErrors({});
        setForm({
            nama_penumpang: item.nama_penumpang,
            rute_perjalanan: item.rute_perjalanan,
            tanggal_berangkat: item.tanggal_berangkat,
            jumlah_tiket: String(item.jumlah_tiket),
        });
        setBuktiBayar(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Batalkan dan hapus pemesanan tiket ini?')) return;

        const res = await fetch(`/tiket/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCsrf(),
            },
        });

        const json = await res.json();
        if (res.ok) {
            setMessage(json.message);
            fetchData();
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pemesanan Tiket (AJAX)', href: '/tiket' }]}>
            <Head title="Pemesanan Tiket" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Pemesanan Tiket Bus TransLive</h1>

                {message && (
                    <div className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800">{message}</div>
                )}

                {/* Form Pemesanan Tiket AJAX */}
                <form onSubmit={handleSubmit} noValidate className="rounded-xl border bg-white p-6 space-y-4 dark:bg-neutral-900">
                    <h2 className="font-semibold">{editId ? 'Edit Pemesanan Tiket' : 'Form Pesan Tiket Baru'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Nama Penumpang</label>
                            <input
                                type="text"
                                value={form.nama_penumpang}
                                onChange={(e) => setForm({ ...form, nama_penumpang: e.target.value })}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            />
                            {errors.nama_penumpang && <p className="text-xs text-red-600 mt-1">{errors.nama_penumpang[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Rute Perjalanan</label>
                            <select
                                value={form.rute_perjalanan}
                                onChange={(e) => setForm({ ...form, rute_perjalanan: e.target.value })}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            >
                                <option value="">-- Pilih Rute --</option>
                                {ruteOptions.map((r: any) => (
                                    <option key={r.id} value={`${r.kota_asal} - ${r.kota_tujuan}`}>
                                        {r.kota_asal} → {r.kota_tujuan} (Rp {Number(r.harga_tiket).toLocaleString('id-ID')})
                                    </option>
                                ))}
                            </select>
                            {errors.rute_perjalanan && <p className="text-xs text-red-600 mt-1">{errors.rute_perjalanan[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tanggal Berangkat</label>
                            <input
                                type="date"
                                value={form.tanggal_berangkat}
                                onChange={(e) => setForm({ ...form, tanggal_berangkat: e.target.value })}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            />
                            {errors.tanggal_berangkat && <p className="text-xs text-red-600 mt-1">{errors.tanggal_berangkat[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Jumlah Tiket</label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={form.jumlah_tiket}
                                onChange={(e) => setForm({ ...form, jumlah_tiket: e.target.value })}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            />
                            {errors.jumlah_tiket && <p className="text-xs text-red-600 mt-1">{errors.jumlah_tiket[0]}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Bukti Pembayaran (JPG/PNG/PDF, Max 2MB)</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setBuktiBayar(e.target.files?.[0] || null)}
                                className="mt-1 w-full rounded-lg border p-1.5 text-sm"
                            />
                            {oldBuktiUrl && (
                                <a href={oldBuktiUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline mt-1 inline-block">
                                    Lihat Bukti Lama
                                </a>
                            )}
                            {errors.bukti_bayar && <p className="text-xs text-red-600 mt-1">{errors.bukti_bayar[0]}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                            {editId ? 'Update Tiket' : 'Pesan Tiket'}
                        </button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">
                                Batal Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Tabel Tiket */}
                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-900">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3">Penumpang</th>
                                <th className="p-3">Rute Perjalanan</th>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Jumlah</th>
                                <th className="p-3">Bukti Bayar</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-neutral-400">Belum ada pemesanan tiket.</td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-3 font-medium">{item.nama_penumpang}</td>
                                        <td className="p-3">{item.rute_perjalanan}</td>
                                        <td className="p-3">{item.tanggal_berangkat}</td>
                                        <td className="p-3">{item.jumlah_tiket} Tiket</td>
                                        <td className="p-3">
                                            <a href={item.bukti_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                Buka Bukti
                                            </a>
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button onClick={() => handleEdit(item)} className="text-amber-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}