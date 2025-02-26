<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // التحقق من دور المستخدم
        if ($request->user() && $request->user()->role_id === 1) {
            return $next($request);
        }
        // response()->json(['message' => 'You do not have permission to view this resource']);
        // إرجاع استجابة من النوع المناسب مع صفحة خطأ عبر Inertia
        return response()->json('Error/Forbidden', 403);
            // 'message' => 'You do not have the required permissions to access this page.'
        // ]);
    }
}
