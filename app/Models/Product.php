<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'price', 'stock'
    ];
    public function scopeGetProducts($query)
    {
        return $query->with('images', 'categories');
    }
    // العلاقة مع الجدول ProductCategories
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    // العلاقة مع الجدول OrderItems
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // العلاقة مع الجدول CartItems
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    // العلاقة مع الجدول WishlistItems
    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }

    // العلاقة مع الجدول Reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // العلاقة مع الجدول ProductImages
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}
