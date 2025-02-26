<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\ProductImage;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class AdminProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['images', 'categories'])->get();
        return inertia('Admin/Products/Index', [
            'products' => $products->toArray()
        ]);
    }

    public function create()
    {

        $categories = Category::all(['id', 'name']);
        return inertia('Admin/Products/Create', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $product = Product::create($request->only(['name', 'description', 'price', 'stock']));
        if ($request->categories) {
            foreach ($request->categories as $categoryId) {
                ProductCategory::create([
                    'product_id' => $product->id,
                    'category_id' => $categoryId, // تأكد من أن كل قيمة هي رقم
                ]);
            }
        }
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductImage::create(['product_id' => $product->id, 'image_url' => $path]);
            }
        }

        return redirect()->route('admin.products.create')->with('success', 'Product created successfully!');
    }



    public function edit(Product $product)
    {
        $categories = Category::all(['id', 'name']);
        return inertia('Admin/Products/Create', [
            'product' => $product, 
            'categories' => $categories,
            'selectedCategories' => $product->categories->pluck('id'), // إرسال الفئات المرتبطة بالمنتج
            'images' => $product->images, // إرسال الصور المرتبطة بالمنتج
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $product->update($request->only(['name', 'description', 'price', 'stock']));

        if ($request->hasFile('images')) {
            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img->image_url);
                $img->delete();
            }
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');
                ProductImage::create(['product_id' => $product->id, 'image_url' => $path]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_url);
            $img->delete();
        }
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully!');
    }
}
