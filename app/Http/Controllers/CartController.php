<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function getItems()
    {
        dump(5);
        try {
            $cartItems = CartItem::with('product')
                ->where('user_id', Auth::id())
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->product_id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'image' => $item->product->image,
                        'quantity' => $item->quantity
                    ];
                });

            return response()->json($cartItems);
        } catch (\Exception $e) {
            Log::error('Cart items fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch cart items'], 500);
        }
    }
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return $this->getItems();
    }

    public function updateQuantity(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        CartItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->update(['quantity' => $request->quantity]);

        return $this->getItems();
    }

    public function remove($productId)
    {
        CartItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        return $this->getItems();
    }

    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();
        return response()->json([]);
    }
}