<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UserMigration extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'int', 'constraint' => 11, 'auto_increment' => true],
            'username' => ['type' => 'varchar', 'constraint' => 30, 'unique' => true],
            'email' => ['type' => 'varchar', 'constraint' => 50, 'null' => true],
            'nama' => ['type' => 'varchar', 'constraint' => 50, 'null' => true],
            'photo' => ['type' => 'varchar', 'constraint' => 50, 'null' => true, 'default' => 'photo.jpg'],
            'password' => ['type' => 'varchar', 'constraint' => 255],
            'created_at' => ['type' => 'datetime', 'null' => true],
            'updated_at' => ['type' => 'datetime', 'null' => true],
            'deleted_at' => ['type' => 'datetime', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('users', true);
    }

    public function down()
    {
        $this->forge->dropTable('users', true);
    }
}
