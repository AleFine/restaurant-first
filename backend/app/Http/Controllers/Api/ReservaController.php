<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservaResource;
use App\Models\Reserva;
use App\Models\Comensal;
use App\Models\Mesa;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Exception;
use Carbon\Carbon;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $query = Reserva::with(['comensal', 'mesa']);

            // filtros
            $query->when($request->filled('fecha'), function ($q) use ($request) {
                return $q->whereDate('fecha', $request->fecha);
            });
            
            $query->when($request->filled('id_comensal'), function ($q) use ($request) {
                return $q->where('id_comensal', $request->id_comensal);
            });
            
            $query->when($request->filled('id_mesa'), function ($q) use ($request) {
                return $q->where('id_mesa', $request->id_mesa);
            });
            
            $query->when($request->filled('personas'), function ($q) use ($request) {
                return $q->where('numero_de_personas', '>=', $request->personas);
            });

            // ordenamiento
            $sortField = $request->input('sort_by', 'fecha');
            $sortDirection = $request->input('sort_dir', 'desc');
            $allowedSortFields = ['fecha', 'hora', 'numero_de_personas'];
            
            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'desc' ? 'desc' : 'asc');
            }

            $reservas = $query->paginate($perPage)->appends($request->query());
            
            return ReservaResource::collection($reservas);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la lista de reservas',
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
                'fecha' => 'required|date|after_or_equal:today',
                'hora' => 'required|date_format:H:i',
                'numero_de_personas' => 'required|integer|min:1',
                'id_comensal' => 'required|exists:comensales,id_comensal',
                'id_mesa' => 'required|exists:mesas,id_mesa'
            ]);

            // validación de capacidad
            $mesa = Mesa::findOrFail($validated['id_mesa']);
            if($mesa->capacidad < $validated['numero_de_personas']) {
                return response()->json([
                    'message' => 'La capacidad de la mesa es insuficiente'
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // validación de reserva existente
            $existingReservation = Reserva::where('id_mesa', $validated['id_mesa'])
                ->whereDate('fecha', $validated['fecha'])
                ->whereTime('hora', '=', $validated['hora'])
                ->exists();

            if($existingReservation) {
                return response()->json([
                    'message' => 'La mesa ya está reservada en esta fecha y hora'
                ], Response::HTTP_CONFLICT);
            }

            $reserva = Reserva::create($validated);
            
            return (new ReservaResource($reserva->load(['comensal', 'mesa'])))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
                
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            
            return response()->json([
                'message' => 'Error al crear la reserva',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al crear la reserva',
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
            $reserva = Reserva::with(['comensal', 'mesa'])->findOrFail($id);
            return new ReservaResource($reserva);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Reserva no encontrada'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la reserva',
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
            $reserva = Reserva::findOrFail($id);
            
            $validated = $request->validate([
                'fecha' => 'sometimes|date|after_or_equal:today',
                'hora' => 'sometimes|date_format:H:i',
                'numero_de_personas' => 'sometimes|integer|min:1',
                'id_comensal' => 'sometimes|exists:comensales,id_comensal',
                'id_mesa' => 'sometimes|exists:mesas,id_mesa'
            ]);

            // validación para la capacidad si se actualiza la mesa
            // o el número de personas
            if(isset($validated['id_mesa'])) {
                $mesa = Mesa::findOrFail($validated['id_mesa']);
                $capacidadRequerida = $validated['numero_de_personas'] ?? $reserva->numero_de_personas;
                
                if($mesa->capacidad < $capacidadRequerida) {
                    return response()->json([
                        'message' => 'La capacidad de la mesa es insuficiente'
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
            }

            // validación en caso se cambiara fecha/hora/mesa
            if(isset($validated['fecha']) || isset($validated['hora']) || isset($validated['id_mesa'])) {
                $fecha = $validated['fecha'] ?? $reserva->fecha;
                $hora = $validated['hora'] ?? $reserva->hora;
                $mesaId = $validated['id_mesa'] ?? $reserva->id_mesa;

                $existingReservation = Reserva::where('id_mesa', $mesaId)
                    ->whereDate('fecha', $fecha)
                    ->whereTime('hora', '=', $hora)
                    ->where('id_reserva', '!=', $id)
                    ->exists();

                if($existingReservation) {
                    return response()->json([
                        'message' => 'La mesa ya está reservada en esta fecha y hora'
                    ], Response::HTTP_CONFLICT);
                }
            }

            $reserva->update($validated);
            
            return new ReservaResource($reserva->load(['comensal', 'mesa']));
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Reserva no encontrada'
            ], Response::HTTP_NOT_FOUND);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Error al actualizar la reserva',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la reserva',
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
            $reserva = Reserva::findOrFail($id);
            $reserva->delete();
            
            return response()->json([
                'message' => 'Reserva eliminada correctamente'
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Reserva no encontrada'
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la reserva',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}