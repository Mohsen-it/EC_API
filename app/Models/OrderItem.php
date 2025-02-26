<?php

// app/Models/OrderItem.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'product_id', 'quantity', 'price'
    ];

    // العلاقة مع الجدول Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // العلاقة مع الجدول Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}