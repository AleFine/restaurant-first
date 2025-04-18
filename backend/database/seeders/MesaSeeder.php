<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MesaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mesas = [
            [
                'numero_mesa' => 'A1',
                'capacidad' => 2,
                'ubicacion' => 'Terraza'
            ],
            [
                'numero_mesa' => 'B2',
                'capacidad' => 4,
                'ubicacion' => 'Interior central'
            ],
            [
                'numero_mesa' => 'C3',
                'capacidad' => 6,
                'ubicacion' => 'Ventana'
            ],
            [
                'numero_mesa' => 'D4',
                'capacidad' => 8,
                'ubicacion' => 'Sala privada'
            ]
        ];

        DB::table('mesas')->insert($mesas);
    }
}
