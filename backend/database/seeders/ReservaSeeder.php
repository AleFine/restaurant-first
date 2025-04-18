<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservas = [
            [
                'fecha' => '2025-04-20',
                'hora' => '18:00:00',
                'numero_de_personas' => 2,
                'id_comensal' => 1,
                'id_mesa' => 1
            ],
            [
                'fecha' => '2025-04-21',
                'hora' => '19:30:00',
                'numero_de_personas' => 4,
                'id_comensal' => 2,
                'id_mesa' => 2
            ],
            [
                'fecha' => '2025-04-22',
                'hora' => '20:00:00',
                'numero_de_personas' => 5,
                'id_comensal' => 3,
                'id_mesa' => 3
            ],
            [
                'fecha' => '2025-04-23',
                'hora' => '21:00:00',
                'numero_de_personas' => 7,
                'id_comensal' => 4,
                'id_mesa' => 4
            ]
        ];

        DB::table('reservas')->insert($reservas);
    }
}
