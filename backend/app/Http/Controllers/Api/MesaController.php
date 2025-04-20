<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MesaResource;
use App\Models\Mesa;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Exception;

class MesaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $query = Mesa::query();

            // Filtro genérico por searchTerm
            $query->when($request->filled('searchTerm'), function ($q) use ($request) {
                $term = $request->searchTerm;
                return $q->where('numero_mesa', 'LIKE', "%{$term}%")
                         ->orWhere('ubicacion', 'LIKE', "%{$term}%");
            });

            $mesas = $query->paginate($perPage)->appends($request->query());
            
            return MesaResource::collection($mesas);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la lista de mesas',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'numero_mesa' => 'required|string|unique:mesas,numero_mesa',
                'capacidad' => 'required|integer|min:1',
                'ubicacion' => 'nullable|string|max:255'
            ]);

            $mesa = Mesa::create($validated);
            
            return (new MesaResource($mesa))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
                
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            
            if ($errorCode == 1062) {
                return response()->json([
                    'message' => 'El número de mesa ya está registrado'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'message' => 'Error al crear la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al crear la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $mesa = Mesa::findOrFail($id);
            return new MesaResource($mesa);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Mesa no encontrada'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $mesa = Mesa::findOrFail($id);
            
            $validated = $request->validate([
                'numero_mesa' => 'sometimes|string|unique:mesas,numero_mesa,' . $mesa->id_mesa . ',id_mesa',
                'capacidad' => 'sometimes|integer|min:1',
                'ubicacion' => 'nullable|string|max:255'
            ]);

            $mesa->update($validated);
            
            return new MesaResource($mesa);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Mesa no encontrada'
            ], Response::HTTP_NOT_FOUND);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            
            if ($errorCode == 1062) {
                return response()->json([
                    'message' => 'El número de mesa ya está en uso'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'message' => 'Error al actualizar la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $mesa = Mesa::findOrFail($id);
            
            // Verificar si tiene reservas primero
            if ($mesa->reservas->count() > 0) {
                return response()->json([
                    'message' => 'No se puede eliminar la mesa porque tiene reservas asociadas'
                ], Response::HTTP_CONFLICT);
            }
            
            $mesa->delete();
            
            return response()->json([
                'message' => 'Mesa eliminada correctamente'
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Mesa no encontrada'
            ], Response::HTTP_NOT_FOUND);
        } catch (QueryException $e) {
            // A veces la verificación anterior puede fallar si la relación no está cargada
            if ($e->errorInfo[1] == 1451) {  // Código MySQL para restricción de clave externa
                return response()->json([
                    'message' => 'No se puede eliminar la mesa porque tiene reservas asociadas'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'message' => 'Error al eliminar la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la mesa',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}