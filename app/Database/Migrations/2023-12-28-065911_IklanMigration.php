<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class IklanMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'int', 'constraint' => 11, 'auto_increment' => true],
            'file' => ['type' => 'varchar', 'constraint' => 255],
            'size' => ['type' => 'int', 'constraint' => 11],
            'jadwal' => ['type' => 'varchar', 'constraint' => 100],
            'created_at' => ['type' => 'datetime', 'null' => true],
            'updated_at' => ['type' => 'datetime', 'null' => true],
            'deleted_at' => ['type' => 'datetime', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('iklan', true);
    }

    public function down()
    {
        $this->forge->dropTable('iklan', true);
    }
}
