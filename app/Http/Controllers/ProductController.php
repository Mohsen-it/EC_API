<?php

namespace App\Http\Controllers;

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

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
 public function index()
{
    return inertia('Products/index', [
        'products' => Product::with('categories', 'images')->paginate(12),
        'categories' => Category::withCount('products')->get()
    ]);
}
    public function show(Product $product)
    {
        // dd($product->load('images'));
        return inertia('Products/Show', [
            'product' => $product->load('images'),
        ]);
    }

    public function addToCart(Request $request)
    {
        // التحقق من أن المنتج موجود
        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // الحصول على سلة المستخدم أو إنشاء واحدة جديدة إذا لم تكن موجودة
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // التحقق من وجود المنتج بالفعل في السلة
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + 1,
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => 1,
            ]);
        }

        return response()->json(['message' => 'Product added to cart successfully']);
    }

    public function getCart()
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', Auth::id())->first();

        if ($cart) {
            $cartItems = CartItem::where('cart_id', $cart->id)
                ->with('product')
                ->get();

            return response()->json(['cart' => $cartItems], 200);
        }

        return response()->json(['cart' => []], 200);
    }


    public function updateQuantity(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity'   => 'required|integer|min:0'
        ]);

        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        // إذا كانت الكمية أقل من 1 يتم الحذف
        if ($request->quantity < 1) {
            $cartItem->delete();
            return response()->json(['message' => 'Cart item removed']);
        } else {
            $cartItem->update(['quantity' => $request->quantity]);
            return response()->json(['message' => 'Cart quantity updated']);
        }
    }

    // دالة لحذف منتج من السلة
    public function removeFromCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer'
        ]);

        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();
        return response()->json(['message' => 'Cart item removed']);
    }

    // باقي الدوال الخاصة بالمنتجات (create, store, show, edit, update, destroy) تبقى دون تغيير

}
