<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use App\Models\ProductImage;
use App\Models\Product;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;

class ProductImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $products = Product::all();
        
        // إنشاء مدير الصور
        $manager = new ImageManager(new Driver());

        // تأكد من وجود الرابط الرمزي للتخزين
        if (!file_exists(public_path('public'))) {
            Artisan::call('storage:link');
        }
        
        $colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        
        foreach ($products as $product) {
            for ($i = 0; $i < rand(1, 5); $i++) {
                $filename = 'product_' . uniqid() . '.jpg';
                
                // إنشاء صورة محلياً
                $image = $manager->create(640, 480);
                
                // تلوين الصورة بلون عشوائي
                $color = $colors[array_rand($colors)];
                $image->fill($color);
                
                // إضافة نص على الصورة
                $image->text('Product ' . $product->id, 320, 240, function ($font) {
                    $font->size(32);
                    $font->color('#ffffff');
                    $font->align('center');
                    $font->valign('middle');
                });
                
                // حفظ الصورة

                Storage::disk('public')->put(
                    'products/' . $filename,
                    $image->encode(new JpegEncoder())->toString()
                );
                
                // حفظ في قاعدة البيانات
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => 'products/' . $filename,

                ]);
            }
        }
    }
}