<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $primaryKey = 'id_reserva';
    public $timestamps = false; // para simplicidad uso false para evitar la creación de columnas created_at y updated_at

    protected $fillable = ['fecha', 'hora', 'numero_de_personas', 'id_comensal', 'id_mesa'];

    public function comensal()
    {
        return $this->belongsTo(Comensal::class, 'id_comensal', 'id_comensal');
    }

    public function mesa()
    {
        return $this->belongsTo(Mesa::class, 'id_mesa', 'id_mesa'); 
    }
}
