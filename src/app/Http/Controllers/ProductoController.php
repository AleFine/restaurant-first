<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto; // Cambié el nombre de la clase a Producto

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Producto::all();
        return response()->json($items);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $items = Producto::create($request->all());
        return response()->json($items, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $item = Producto::find($id);
        if (!$item) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }
        return response()->json($item);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $item = Producto::find($id);
        $item->update($request->all());
        return response()->json($item, 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Producto::destroy($id);
        return response()->json(['message' => 'Producto eliminado'], 200);
    }
}
