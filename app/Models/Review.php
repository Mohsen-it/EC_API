<?php

// app/Models/Review.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'user_id', 'rating', 'comment'
    ];

    // العلاقة مع الجدول Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // العلاقة مع الجدول User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}