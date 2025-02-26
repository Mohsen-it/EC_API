<?php

// app/Models/ProductCategory.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'category_id'
    ];

    // العلاقة مع الجدول Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // العلاقة مع الجدول Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}