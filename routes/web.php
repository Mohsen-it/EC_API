<?php

use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Auth\AdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ],
        'app' => [
            'name' => config('app.name'),
            'environment' => app()->environment(),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ],
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Authentication Required Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile Management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Products & Shopping
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
    });

    // Cart Management
    Route::prefix('cart')->name('cart.')->group(function () {
        // Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::post('/add', [ProductController::class, 'addToCart'])->name('add');
        Route::get('/get', [ProductController::class, 'getCart'])->name('get');
        Route::post('/update-quantity', [ProductController::class, 'updateQuantity'])->name('updateQuantity');
        Route::post('/remove', [ProductController::class, 'removeFromCart'])->name('remove');
    });

    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/create', [OrderController::class, 'create'])->name('orders.create');
        Route::post('/', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::patch('/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    });
        Route::get('/checkout', [OrderController::class, 'createFromCart'])->name('orders.createFromCart');
        Route::post('/checkout', [OrderController::class, 'storeFromCart'])->name('orders.storeFromCart');
        // ... باقي المسارات
    
    // Orders
    // Route::prefix('orders')->name('orders.')->group(function () {
    //     Route::get('/', [OrderController::class, 'index'])->name('index');
    //     Route::get('/{order}', [OrderController::class, 'show'])->name('show');
    // });
    
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    // Products Management
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [AdminProductController::class, 'index'])->name('index');
        Route::get('/create', [AdminProductController::class, 'create'])->name('create');
        Route::post('/', [AdminProductController::class, 'store'])->name('store');
        Route::get('/{product}/edit', [AdminProductController::class, 'edit'])->name('edit');
        Route::put('/{product}', [AdminProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [AdminProductController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [AdminCategoryController::class, 'index'])->name('index');
        Route::get('/create', [AdminCategoryController::class, 'create'])->name('create');
        Route::post('/', [AdminCategoryController::class, 'store'])->name('store');
        Route::get('/{category}/edit', [AdminCategoryController::class, 'edit'])->name('edit');
        Route::put('/{category}', [AdminCategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [AdminCategoryController::class, 'destroy'])->name('destroy');
    });
});

// Authentication Routes
require __DIR__ . '/auth.php';