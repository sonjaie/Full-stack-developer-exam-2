<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sample;

class SampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sample::create([
            'name' => 'Sample 1',
            'description' => 'Description of Sample 1',
        ]);

        Sample::create([
            'name' => 'Sample 2',
            'description' => 'Description of Sample 2',
        ]);
    }
}
