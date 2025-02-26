<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class AdminCategoryController extends Controller
{
    public function index()
    {
        return inertia('Admin/Categories/Index', [
            'categories' => Category::all()
        ]);
    }

  public function edit(Category $category)
{
    return inertia('Admin/Categories/Create', [
        'category' => $category
    ]);
}

public function update(Request $request, Category $category)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string'
    ]);

    $category->update($validated);

    return redirect()
        ->route('admin.categories.index')
        ->with('success', 'Category updated successfully!');
}

public function create()
{
    return inertia('Admin/Categories/Create');
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string'
    ]);

    Category::create($validated);

    return redirect()
        ->route('admin.categories.index')
        ->with('success', 'Category created successfully!');
}

public function destroy(Category $category)
{
    $category->delete();

    return redirect()
        ->route('admin.categories.index')
        ->with('success', 'Category deleted successfully!');
}
}
