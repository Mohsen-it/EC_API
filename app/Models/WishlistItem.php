<?php

// app/Models/WishlistItem.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishlistItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'wishlist_id', 'product_id'
    ];

    // العلاقة مع الجدول Wishlist
    public function wishlist()
    {
        return $this->belongsTo(Wishlist::class);
    }

    // العلاقة مع الجدول Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}