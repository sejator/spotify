<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class LokasiMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'int', 'constraint' => 11, 'auto_increment' => true],
            'kota_id' => ['type' => 'int', 'constraint' => 11],
            'kota' => ['type' => 'varchar', 'constraint' => 100],
            'created_at' => ['type' => 'datetime', 'null' => true],
            'updated_at' => ['type' => 'datetime', 'null' => true],
            'deleted_at' => ['type' => 'datetime', 'null' => true],
        ]);

        $this->forge->addKey('id', true)->addKey('kota_id');
        $this->forge->createTable('lokasi', true);
    }

    public function down()
    {
        $this->forge->dropTable('lokasi', true);
    }
}
