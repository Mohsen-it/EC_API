<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create(); 

        for ($i = 0; $i < 20; $i++) { 
            Product::create([
                'name' => $faker->words(3, true),
                'description' => $faker->paragraph, 
                'price' => $faker->randomFloat(2, 10, 1000), 
                'stock' => $faker->numberBetween(0, 100),
            ]);
        }
    }
}
