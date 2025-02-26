<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'total', 'status'
    ];

    // العلاقة مع الجدول User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // العلاقة مع الجدول OrderItems
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}