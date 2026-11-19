import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Bus, MapPin, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface RuteItem {
    id: number;
    kode_rute: string;
    kota_asal: string;
    kota_tujuan: string;
    harga_tiket: number;
    status_rute: 'Aktif' | 'Nonaktif';
}

interface DashboardProps {
    totalRute: number;
    totalArmada: number;
    totalUsers: number;
    recentRutes: RuteItem[];
}

export default function Dashboard({
    totalRute = 0,
    totalArmada = 0,
    totalUsers = 0,
    recentRutes = [],
}: DashboardProps) {
    const { auth }: any = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2">
                        <Bus className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard TransLive</h1>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                        Selamat datang, <span className="font-medium text-neutral-800 dark:text-neutral-200">{auth?.user?.name}</span>! Kelola rute perjalanan area Sumedang dan operasional armada bus secara terintegrasi.
                    </p>
                </div>

                {/* Kartu Statistik (3 Kolom untuk Admin, 2 Kolom untuk User) */}
                <div className={`grid grid-cols-1 gap-4 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {/* Total Rute */}
                    <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                        <div>
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Rute</p>
                            <p className="mt-2 text-3xl font-bold">{totalRute}</p>
                            <p className="mt-2 text-xs text-neutral-400">Rute perjalanan terdaftar</p>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <MapPin className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Total Armada */}
                    <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                        <div>
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Armada</p>
                            <p className="mt-2 text-3xl font-bold">{totalArmada}</p>
                            <p className="mt-2 text-xs text-neutral-400">Unit armada bus operasional</p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Bus className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Total Pengguna (Khusus Admin) */}
                    {isAdmin && (
                        <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Pengguna</p>
                                <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
                                <p className="mt-2 text-xs text-neutral-400">Akun terdaftar di sistem</p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabel Rute Terbaru */}
                <div className="rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold">Daftar Rute Terbaru</h2>
                            <p className="text-xs text-neutral-500">Lima rute perjalanan terakhir di area Sumedang & sekitarnya.</p>
                        </div>
                        <Link
                            href="/rute"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Lihat Semua <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-neutral-50 text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Kode</th>
                                    <th className="px-4 py-3 font-medium">Kota Asal</th>
                                    <th className="px-4 py-3 font-medium">Kota Tujuan</th>
                                    <th className="px-4 py-3 font-medium">Harga Tiket</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentRutes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                                            Belum ada data rute.
                                        </td>
                                    </tr>
                                ) : (
                                    recentRutes.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 font-medium">{item.kode_rute}</td>
                                            <td className="px-4 py-3">{item.kota_asal}</td>
                                            <td className="px-4 py-3">{item.kota_tujuan}</td>
                                            <td className="px-4 py-3">Rp {Number(item.harga_tiket).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        item.status_rute === 'Aktif'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                                    }`}
                                                >
                                                    {item.status_rute}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Informasi TransLive */}
                <div className="rounded-xl border bg-white p-6 shadow-xs dark:bg-neutral-900">
                    <h2 className="text-base font-semibold">Informasi TransLive</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        TransLive merupakan sistem informasi manajemen rute angkutan dan armada bus untuk mempermudah pemantauan jadwal, tarif, dan ketersediaan armada.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}