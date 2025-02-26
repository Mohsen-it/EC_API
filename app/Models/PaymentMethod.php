<?php

// app/Models/PaymentMethod.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'card_number', 'card_holder_name', 'expiration_date', 'cvv'
    ];

    // العلاقة مع الجدول User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}