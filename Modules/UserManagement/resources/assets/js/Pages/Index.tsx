import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UserManagementIndex({ users }: { users: any[] }) {
    const { auth, flash }: any = usePage().props;
    const currentUserId = auth?.user?.id;
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleEdit = (u: any) => {
        setEditId(u.id);
        clearErrors();
        setData({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
        });
    };

    const resetForm = () => {
        setEditId(null);
        clearErrors();
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            put(`/users/${editId}`, { onSuccess: () => resetForm() });
        } else {
            post('/users', { onSuccess: () => resetForm() });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pengguna ini?')) {
            router.delete(`/users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola User', href: '/users' }]}>
            <Head title="Kelola User" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Kelola Pengguna TransLive</h1>

                {flash?.success && (
                    <div className="rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800">{flash.success}</div>
                )}

                {/* Form Tambah / Edit User */}
                <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 space-y-4 dark:bg-neutral-900">
                    <h2 className="font-semibold">{editId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Nama Lengkap</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            />
                            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            />
                            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Password {editId && <span className="text-xs text-neutral-400">(opsional)</span>}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 w-full rounded-lg border p-2 text-sm"
                            />
                            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Role</label>
                            <select
                                value={data.role}
                                disabled={editId === currentUserId}
                                onChange={(e) => setData('role', e.target.value)}
                                className="mt-1 w-full rounded-lg border p-2 text-sm disabled:opacity-50"
                            >
                                <option value="user">User (Penumpang)</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                            {editId ? 'Update User' : 'Simpan User'}
                        </button>
                        {editId && (
                            <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">
                                Batal
                            </button>
                        )}
                    </div>
                </form>

                {/* Tabel Pengguna */}
                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-900">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="p-3 font-medium">
                                        {u.name} {u.id === currentUserId && <span className="text-xs text-blue-600">(Anda)</span>}
                                    </td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs uppercase font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-800'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button onClick={() => handleEdit(u)} className="text-amber-600 hover:underline">Edit</button>
                                        {u.id !== currentUserId && (
                                            <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Hapus</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}