import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function RuteIndex({ rutes, filters }: any) {
    const { auth, flash }: any = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    const [search, setSearch] = useState(filters?.search || '');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        kode_rute: '',
        kota_asal: '',
        kota_tujuan: '',
        estimasi_waktu: '',
        harga_tiket: '',
        status_rute: 'Aktif',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/rute', { search }, { preserveState: true });
    };

    const openCreate = () => {
        setEditId(null);
        reset();
        clearErrors();
        setShowForm(true);
    };

    const openEdit = (item: any) => {
        setEditId(item.id);
        clearErrors();
        setData({
            kode_rute: item.kode_rute,
            kota_asal: item.kota_asal,
            kota_tujuan: item.kota_tujuan,
            estimasi_waktu: item.estimasi_waktu,
            harga_tiket: String(item.harga_tiket),
            status_rute: item.status_rute,
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            put(`/rute/${editId}`, {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        } else {
            post('/rute', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus rute ini?')) {
            router.delete(`/rute/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Data Rute Bus', href: '/rute' }]}>
            <Head title="Data Rute Bus" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Rute TransLive</h1>
                    {isAdmin && (
                        <button
                            onClick={openCreate}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            + Tambah Rute
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800">{flash.success}</div>
                )}

                {/* Form Tambah / Edit (Khusus Admin) */}
                {isAdmin && showForm && (
                    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 space-y-4 dark:bg-neutral-900">
                        <h2 className="font-semibold">{editId ? 'Edit Data Rute' : 'Tambah Rute Baru'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Kode Rute</label>
                                <input
                                    type="text"
                                    value={data.kode_rute}
                                    onChange={(e) => setData('kode_rute', e.target.value)}
                                    placeholder="RT-001"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.kode_rute && <p className="text-xs text-red-600 mt-1">{errors.kode_rute}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Kota Asal</label>
                                <input
                                    type="text"
                                    value={data.kota_asal}
                                    onChange={(e) => setData('kota_asal', e.target.value)}
                                    placeholder="Bandung"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.kota_asal && <p className="text-xs text-red-600 mt-1">{errors.kota_asal}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Kota Tujuan</label>
                                <input
                                    type="text"
                                    value={data.kota_tujuan}
                                    onChange={(e) => setData('kota_tujuan', e.target.value)}
                                    placeholder="Jakarta"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.kota_tujuan && <p className="text-xs text-red-600 mt-1">{errors.kota_tujuan}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Estimasi Waktu</label>
                                <input
                                    type="text"
                                    value={data.estimasi_waktu}
                                    onChange={(e) => setData('estimasi_waktu', e.target.value)}
                                    placeholder="3 Jam 30 Menit"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.estimasi_waktu && <p className="text-xs text-red-600 mt-1">{errors.estimasi_waktu}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Harga Tiket (Rp)</label>
                                <input
                                    type="number"
                                    value={data.harga_tiket}
                                    onChange={(e) => setData('harga_tiket', e.target.value)}
                                    placeholder="120000"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.harga_tiket && <p className="text-xs text-red-600 mt-1">{errors.harga_tiket}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Status Rute</label>
                                <select
                                    value={data.status_rute}
                                    onChange={(e) => setData('status_rute', e.target.value)}
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Nonaktif">Nonaktif</option>
                                </select>
                                {errors.status_rute && <p className="text-xs text-red-600 mt-1">{errors.status_rute}</p>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                {editId ? 'Update Rute' : 'Simpan Rute'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg border px-4 py-2 text-sm"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                {/* Pencarian */}
                <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode, kota asal, atau tujuan..."
                        className="w-full rounded-lg border p-2 text-sm"
                    />
                    <button type="submit" className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white">
                        Cari
                    </button>
                </form>

                {/* Tabel Data Rute */}
                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-900">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3">Kode</th>
                                <th className="p-3">Asal</th>
                                <th className="p-3">Tujuan</th>
                                <th className="p-3">Estimasi</th>
                                <th className="p-3">Harga Tiket</th>
                                <th className="p-3">Status</th>
                                {isAdmin && <th className="p-3">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rutes.data.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="p-3 font-medium">{item.kode_rute}</td>
                                    <td className="p-3">{item.kota_asal}</td>
                                    <td className="p-3">{item.kota_tujuan}</td>
                                    <td className="p-3">{item.estimasi_waktu}</td>
                                    <td className="p-3">Rp {Number(item.harga_tiket).toLocaleString('id-ID')}</td>
                                    <td className="p-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${item.status_rute === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.status_rute}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="p-3 space-x-2">
                                            <button onClick={() => openEdit(item)} className="text-amber-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-1">
                    {rutes.links.map((link: any, i: number) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded border px-3 py-1 text-xs ${link.active ? 'bg-blue-600 text-white' : 'bg-white'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}