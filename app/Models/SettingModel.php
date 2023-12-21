<?php

namespace App\Models;

use CodeIgniter\Model;

class SettingModel extends Model
{
    protected $table          = 'setting';
    protected $primaryKey     = 'id';
    protected $useSoftDeletes = false;
    protected $allowedFields  = [];

    public function validasiUser($username)
    {
        return $this->builder('users')->where('username', $username)->get()->getRow();
    }

    public function getSetting()
    {
        return $this->builder($this->table)->get(1)->getRow();
    }

    public function updateSetting($data)
    {
        return $this->builder($this->table)->update($data);
    }

    public function getLokasi()
    {
        return $this->builder('lokasi')->orderBy('lokasi')->get()->getResult();
    }

    public function findLokasiId($id)
    {
        return $this->builder('lokasi')->where('id', $id)->get()->getRow();
    }

    public function saveLokasi($data)
    {
        return $this->builder('lokasi')->insert($data);
    }

    public function getBacksound($id = '')
    {
        if ($id == '') {
            return $this->builder('backsound')->get()->getResult();
        } else {
            return $this->builder('backsound')->where('id', $id)->get()->getRow();
        }
    }

    public function getBacksoundAjax($param)
    {
        $kolom = [
            0 => 'file',
            1 => 'file',
        ];

        return $this->builder('backsound')->orderBy($kolom[$param['order']], $param['dir'])
            ->get($param['length'], $param['start'])->getResult();
    }

    public function uploadBacksound($data)
    {
        return $this->builder('backsound')->insert($data);
    }

    public function hapusBacksound($id)
    {
        return $this->builder('backsound')->where('id', $id)->delete();
    }

    public function getIklan($id = '')
    {
        if ($id == '') {
            return $this->builder('iklan')->get()->getResult();
        } else {
            return $this->builder('iklan')->where('id', $id)->get()->getRow();
        }
    }

    public function getIklanAjax($param)
    {
        $kolom = [
            0 => 'id',
            1 => 'file',
        ];

        return $this->builder('iklan')->orderBy($kolom[$param['order']], $param['dir'])
            ->get($param['length'], $param['start'])->getResult();
    }

    public function uploadIklan($data)
    {
        return $this->builder('iklan')->insert($data);
    }

    public function hapusIklan($id)
    {
        return $this->builder('iklan')->where('id', $id)->delete();
    }

    public function deleteSession($timestamp)
    {
        return $this->builder('ci_sessions')->where('timestamp !=', $timestamp)->delete();
    }
}
