<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run()
    {
        $this->db->table('setting')->insert([
            'nama_app' => 'Spotify Music By MIS',
            'kota_id' => 14,
            'suara_adzan' => 1, // 0: Non Aktif, 1: Aktif,
            'jeda_adzan' => 2, // 2 menit,
            'jeda_iklan' => 1, // 1 detik,
            'cek_info' => 1, // 0: Non Aktif, 1: Aktif,
            'pencarian' => 1, // 0: Non Aktif, 1: Aktif,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
