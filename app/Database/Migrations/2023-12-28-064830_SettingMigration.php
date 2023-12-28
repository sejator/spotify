<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SettingMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'int', 'constraint' => 11, 'auto_increment' => true],
            'nama_app' => ['type' => 'varchar', 'constraint' => 100],
            'kota_id' => ['type' => 'int', 'constraint' => 11],
            'suara_adzan' => ['type' => 'int', 'constraint' => 11, 'default' => 1],
            'jeda_adzan' => ['type' => 'int', 'constraint' => 11, 'default' => 2],
            'jeda_iklan' => ['type' => 'int', 'constraint' => 11, 'default' => 1],
            'cek_info' => ['type' => 'int', 'constraint' => 11, 'default' => 1],
            'pencarian' => ['type' => 'int', 'constraint' => 11, 'default' => 0],
            'created_at' => ['type' => 'datetime', 'null' => true],
            'updated_at' => ['type' => 'datetime', 'null' => true],
            'deleted_at' => ['type' => 'datetime', 'null' => true],
        ]);

        $this->forge->addKey('id', true)->addKey('kota_id');
        $this->forge->createTable('setting', true);
    }

    public function down()
    {
        $this->forge->dropTable('setting', true);
    }
}
