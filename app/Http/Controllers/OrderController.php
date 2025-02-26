<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->get();
            
        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function createFromCart()
    {
        $cartItems = CartItem::where('user_id', auth()->id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->back()
                ->with('error', 'سلة التسوق فارغة');
        }

        return Inertia::render('Orders/Checkout', [
            'cartItems' => $cartItems,
            'total' => $cartItems->sum(function($item) {
                return $item->quantity * $item->product->price;
            })
        ]);
    }

    public function storeFromCart(Request $request)
    {
        try {
            DB::beginTransaction();

            // Get cart items
            $cartItems = CartItem::where('user_id', auth()->id())
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('سلة التسوق فارغة');
            }

            // Calculate total
            $total = $cartItems->sum(function($item) {
                return $item->quantity * $item->product->price;
            });

            // Create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'total' => $total,
                'status' => 'pending'
            ]);

            // Create order items from cart items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price
                ]);
            }

            // Clear cart after successful order
            CartItem::where('user_id', auth()->id())->delete();

            DB::commit();

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'تم إنشاء الطلب بنجاح');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'حدث خطأ أثناء إنشاء الطلب');
        }
    }

    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);
        
        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Order $order, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        $order->update(['status' => $request->status]);
        
        return back()->with('success', 'تم تحديث حالة الطلب بنجاح');
    }
}