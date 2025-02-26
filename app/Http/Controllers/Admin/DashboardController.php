<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $data = [
                'usersCount' => User::count() ?? 0,
                'productsCount' => Product::count() ?? 0,
                'categoriesCount' => Category::count() ?? 0,
            ];

            return inertia('Admin/Dashboard', $data);
            
        } catch (\Exception $e) {
            return inertia('Admin/Dashboard', [
                'usersCount' => 0,
                'productsCount' => 0,
                'categoriesCount' => 0,
                'error' => 'Error loading dashboard data'
            ]);
        }
    }
  
}