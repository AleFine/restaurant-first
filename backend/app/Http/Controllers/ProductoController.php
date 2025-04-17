<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

/**
 * @OA\Tag(
 *     name="Productos",
 *     description="Operaciones relacionadas con productos"
 * )
 */
class ProductoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/productos",
     *     tags={"Productos"},
     *     summary="Listar todos los productos sumario",
     *     @OA\Response(
     *         response=200,
     *         description="Listado de productos descripción",
     *     )
     * )
     */
    public function index()
    {
        $items = Producto::all();
        return response()->json($items);
    }

    /**
     * @OA\Post(
     *     path="/api/productos",
     *     tags={"Productos"},
     *     summary="Crear un nuevo producto",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombre", "precio"},
     *             @OA\Property(property="nombre", type="string", example="Camiseta"),
     *             @OA\Property(property="precio", type="number", format="float", example=29.99)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Producto creado"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $items = Producto::create($request->all());
        return response()->json($items, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/productos/{id}",
     *     tags={"Productos"},
     *     summary="Obtener un producto por ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto encontrado"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Producto no encontrado"
     *     )
     * )
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
     * @OA\Put(
     *     path="/api/productos/{id}",
     *     tags={"Productos"},
     *     summary="Actualizar un producto existente",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nombre", type="string", example="Camisa actualizada"),
     *             @OA\Property(property="precio", type="number", format="float", example=39.99)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto actualizado"
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $item = Producto::find($id);
        $item->update($request->all());
        return response()->json($item, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/productos/{id}",
     *     tags={"Productos"},
     *     summary="Eliminar un producto por ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Producto eliminado"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        Producto::destroy($id);
        return response()->json(['message' => 'Producto eliminado'], 200);
    }

    public function create()
    {
        //
    }

    public function edit(string $id)
    {
        //
    }
}
