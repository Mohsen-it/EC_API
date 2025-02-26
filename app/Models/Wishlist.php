<?php

// app/Models/Wishlist.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    // العلاقة مع الجدول User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // العلاقة مع الجدول WishlistItems
    public function items()
    {
        return $this->hasMany(WishlistItem::class);
    }
}