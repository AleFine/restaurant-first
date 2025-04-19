<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComensalResource;
use App\Models\Comensal;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Exception;

class ComensalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // paginación
            $perPage = $request->input('per_page', 15); 
            $query = Comensal::query();

            // filtro genérico por término de búsqueda
            $query->when($request->filled('searchTerm'), function ($q) use ($request) {
                return $q->where('nombre', 'LIKE', '%' . $request->searchTerm . '%')
                         ->orWhere('correo', 'LIKE', '%' . $request->searchTerm . '%')
                         ->orWhere('telefono', 'LIKE', '%' . $request->searchTerm . '%');
            });

            $comensales = $query->paginate($perPage)->appends($request->query());
            
            return ComensalResource::collection($comensales);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la lista de comensales',
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
                'nombre' => 'required|string|max:255',
                'correo' => 'required|email|unique:comensales,correo',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:255'
            ]);

            $comensal = Comensal::create($validated);
            
            return (new ComensalResource($comensal))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
                
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            // captura de errores de base de datos
            $errorCode = $e->errorInfo[1] ?? null;
            
            if ($errorCode == 1062) { // este es el código de mysql para duplicado
                return response()->json([
                    'message' => 'El correo electrónico ya está registrado'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'message' => 'Error al crear el comensal',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al crear el comensal',
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
            $comensal = Comensal::findOrFail($id);
            return new ComensalResource($comensal);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comensal no encontrado'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el comensal',
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
            $comensal = Comensal::findOrFail($id);
            
            $validated = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'correo' => 'sometimes|email|unique:comensales,correo,' . $comensal->id_comensal . ',id_comensal',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:255'
            ]);

            $comensal->update($validated);
            
            return new ComensalResource($comensal);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comensal no encontrado'
            ], Response::HTTP_NOT_FOUND);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            // captura de errores de base de datos
            $errorCode = $e->errorInfo[1] ?? null;
            
            if ($errorCode == 1062) { // este es el código de mysql para duplicado
                return response()->json([
                    'message' => 'El correo electrónico ya está registrado por otro comensal'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'message' => 'Error al actualizar el comensal',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el comensal',
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
            $comensal = Comensal::findOrFail($id);
            $comensal->delete();
            
            return response()->json([
                'message' => 'Comensal eliminado correctamente'
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comensal no encontrado'
            ], Response::HTTP_NOT_FOUND);
        } catch (QueryException $e) {
            // si hay referencias a este comensal en otras tablas
            if ($e->errorInfo[1] == 1451) { // este es el codigo mysql para restricciones de clave foránea
                return response()->json([
                    'message' => 'No se puede eliminar el comensal porque tiene registros relacionados'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'message' => 'Error al eliminar el comensal',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el comensal',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}