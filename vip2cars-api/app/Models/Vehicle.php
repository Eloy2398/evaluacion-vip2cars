<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'placa',
        'modelo',
        'marca',
        'anio_fabricacion'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
