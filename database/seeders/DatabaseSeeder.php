<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\CategoriesTableSeeder;
use Database\Seeders\ProductsTableSeeder;
use Database\Seeders\ProductCategoriesTableSeeder;
use Database\Seeders\ProductImagesTableSeeder;
use Database\Seeders\RolesSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            CategoriesTableSeeder::class,
            ProductsTableSeeder::class,
            ProductCategoriesTableSeeder::class,
            ProductImagesTableSeeder::class,
            RolesSeeder::class
        ]);
        
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => bcrypt('123'),
            'role_id' => 3,
        ]); 
          User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('123'),
            'role_id' => 1,
        ]);
    }
}
