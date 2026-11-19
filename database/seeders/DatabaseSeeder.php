<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin TransLive',
            'email' => 'admin@translive.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Penumpang TransLive',
            'email' => 'user@translive.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }
}