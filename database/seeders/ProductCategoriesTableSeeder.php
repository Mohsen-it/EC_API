<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\Category;

class ProductCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $categories = Category::all();

        // التأكد من وجود منتجات وفئات
        if ($products->isEmpty() || $categories->isEmpty()) {
            $this->command->info('No products or categories found! Please seed products and categories first.');
            return;
        }

        // ربط كل منتج بعدة فئات عشوائية
        foreach ($products as $product) {
            // اختيار عدد عشوائي من الفئات (بين 1 و 3)
            $randomCategories = $categories->random(rand(1, 3));

            // ربط المنتج بالفئات المختارة
            foreach ($randomCategories as $category) {
                ProductCategory::create([
                    'product_id' => $product->id,
                    'category_id' => $category->id,
                ]);
            }
        }

        $this->command->info('Product categories seeded successfully!');
    }
}
