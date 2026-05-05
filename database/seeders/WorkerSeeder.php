<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Worker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Worker::factory(4)->recycle(User::where('role', 'engineer')->first())->create();
    }
}
