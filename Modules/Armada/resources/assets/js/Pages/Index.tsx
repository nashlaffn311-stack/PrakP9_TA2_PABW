import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function ArmadaIndex() {
    const { auth }: any = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    const [items, setItems] = useState<any[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [oldFotoUrl, setOldFotoUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [message, setMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({
        nomor_polisi: '',
        nama_po: '',
        kelas_bus: 'Eksekutif',
        kapasitas_kursi: '',
        status_operasi: 'Beroperasi',
    });
    const [fotoArmada, setFotoArmada] = useState<File | null>(null);

    const getCsrf = () =>
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const fetchData = async () => {
        const res = await fetch('/armada/data', { headers: { Accept: 'application/json' } });
        const json = await res.json();
        setItems(json.data || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setEditId(null);
        setOldFotoUrl(null);
        setErrors({});
        setForm({
            nomor_polisi: '',
            nama_po: '',
            kelas_bus: 'Eksekutif',
            kapasitas_kursi: '',
            status_operasi: 'Beroperasi',
        });
        setFotoArmada(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setMessage(null);

        const fd = new FormData();
        fd.append('nomor_polisi', form.nomor_polisi);
        fd.append('nama_po', form.nama_po);
        fd.append('kelas_bus', form.kelas_bus);
        fd.append('kapasitas_kursi', form.kapasitas_kursi);
        fd.append('status_operasi', form.status_operasi);
        if (fotoArmada) fd.append('foto_armada', fotoArmada);

        const url = editId ? `/armada/${editId}` : '/armada';
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
        setOldFotoUrl(item.foto_url);
        setErrors({});
        setForm({
            nomor_polisi: item.nomor_polisi,
            nama_po: item.nama_po,
            kelas_bus: item.kelas_bus,
            kapasitas_kursi: String(item.kapasitas_kursi),
            status_operasi: item.status_operasi,
        });
        setFotoArmada(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus data armada beserta berkas fotonya?')) return;

        const res = await fetch(`/armada/${id}`, {
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
        <AppLayout breadcrumbs={[{ title: 'Data Armada (AJAX)', href: '/armada' }]}>
            <Head title="Data Armada Bus" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Manajemen Armada Bus (CRUD AJAX)</h1>

                {message && (
                    <div className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800">{message}</div>
                )}

                {/* Form AJAX hanya tampil untuk Admin */}
                {isAdmin && (
                    <form onSubmit={handleSubmit} noValidate className="rounded-xl border bg-white p-6 space-y-4 dark:bg-neutral-900">
                        <h2 className="font-semibold">{editId ? 'Edit Data Armada' : 'Tambah Armada Baru'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Nomor Polisi</label>
                                <input
                                    type="text"
                                    value={form.nomor_polisi}
                                    onChange={(e) => setForm({ ...form, nomor_polisi: e.target.value })}
                                    placeholder="Z 7890 AB"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.nomor_polisi && <p className="text-xs text-red-600 mt-1">{errors.nomor_polisi[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Nama PO Bus</label>
                                <input
                                    type="text"
                                    value={form.nama_po}
                                    onChange={(e) => setForm({ ...form, nama_po: e.target.value })}
                                    placeholder="PO Medal Sekarwangi"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.nama_po && <p className="text-xs text-red-600 mt-1">{errors.nama_po[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Kelas Bus</label>
                                <select
                                    value={form.kelas_bus}
                                    onChange={(e) => setForm({ ...form, kelas_bus: e.target.value })}
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                >
                                    <option value="Ekonomi">Ekonomi</option>
                                    <option value="Bisnis">Bisnis</option>
                                    <option value="Eksekutif">Eksekutif</option>
                                </select>
                                {errors.kelas_bus && <p className="text-xs text-red-600 mt-1">{errors.kelas_bus[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Kapasitas Kursi</label>
                                <input
                                    type="number"
                                    value={form.kapasitas_kursi}
                                    onChange={(e) => setForm({ ...form, kapasitas_kursi: e.target.value })}
                                    placeholder="40"
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                />
                                {errors.kapasitas_kursi && <p className="text-xs text-red-600 mt-1">{errors.kapasitas_kursi[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Status Operasi</label>
                                <select
                                    value={form.status_operasi}
                                    onChange={(e) => setForm({ ...form, status_operasi: e.target.value })}
                                    className="mt-1 w-full rounded-lg border p-2 text-sm"
                                >
                                    <option value="Beroperasi">Beroperasi</option>
                                    <option value="Perawatan">Perawatan</option>
                                </select>
                                {errors.status_operasi && <p className="text-xs text-red-600 mt-1">{errors.status_operasi[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Foto / Dokumen Armada (JPG/PNG/PDF, Max 2MB)</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setFotoArmada(e.target.files?.[0] || null)}
                                    className="mt-1 w-full rounded-lg border p-1.5 text-sm"
                                />
                                {oldFotoUrl && (
                                    <a href={oldFotoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline mt-1 inline-block">
                                        Lihat Berkas Lama
                                    </a>
                                )}
                                {errors.foto_armada && <p className="text-xs text-red-600 mt-1">{errors.foto_armada[0]}</p>}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                                {editId ? 'Update Armada' : 'Simpan Armada'}
                            </button>
                            {editId && (
                                <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">
                                    Batal Edit
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* Tabel Data Real-Time Tanpa Reload */}
                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-900">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3">No. Polisi</th>
                                <th className="p-3">Nama PO</th>
                                <th className="p-3">Kelas</th>
                                <th className="p-3">Kursi</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Berkas Armada</th>
                                {isAdmin && <th className="p-3">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 7 : 6} className="p-4 text-center text-neutral-400">
                                        Belum ada data armada.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-3 font-medium">{item.nomor_polisi}</td>
                                        <td className="p-3">{item.nama_po}</td>
                                        <td className="p-3">{item.kelas_bus}</td>
                                        <td className="p-3">{item.kapasitas_kursi} Kursi</td>
                                        <td className="p-3">{item.status_operasi}</td>
                                        <td className="p-3">
                                            <a href={item.foto_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                Buka Berkas
                                            </a>
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3 space-x-2">
                                                <button onClick={() => handleEdit(item)} className="text-amber-600 hover:underline">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                                                    Hapus
                                                </button>
                                            </td>
                                        )}
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