<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComensalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comensales = [
            [
                'nombre' => 'Ana Martínez',
                'correo' => 'ana.martinez@email.com',
                'telefono' => '555-123-4567',
                'direccion' => 'Calle Principal 123, Ciudad'
            ],
            [
                'nombre' => 'Carlos Rodríguez',
                'correo' => 'carlos.rodriguez@email.com',
                'telefono' => '555-234-5678',
                'direccion' => 'Avenida Central 456, Ciudad'
            ],
            [
                'nombre' => 'María López',
                'correo' => 'maria.lopez@email.com',
                'telefono' => '555-345-6789',
                'direccion' => 'Boulevard Norte 789, Ciudad'
            ],
            [
                'nombre' => 'Juan Pérez',
                'correo' => 'juan.perez@email.com',
                'telefono' => '555-456-7890',
                'direccion' => 'Calle Secundaria 101, Ciudad'
            ]
        ];

        DB::table('comensales')->insert($comensales);
    }
}
