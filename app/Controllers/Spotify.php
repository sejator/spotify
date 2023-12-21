<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use SpotifyWebAPI\SpotifyWebAPI;

class Spotify extends BaseController
{

    private static $api, $device = [];

    public function __construct()
    {
        self::$api = new SpotifyWebAPI();
    }

    public function setToken($accessToken)
    {
        self::$api->setAccessToken($accessToken);
        $this->_getDevice();
    }

    public function playlist()
    {
        $me = self::$api->me();

        return self::$api->getUserPlaylists($me->id);
    }

    public function detailPlaylist($id)
    {
        return self::$api->getPlaylistTracks($id);
    }

    public function topArtis()
    {
        return self::$api->getMyTop('artists');
    }

    public function detailArtis($id)
    {
        return self::$api->getArtist($id);
    }

    public function artisTrack($id_artis)
    {
        return self::$api->getArtistTopTracks($id_artis, ['market' => 'ID']);
    }

    public function detailAlbum($id)
    {
        return self::$api->getAlbum($id);
    }

    public function cari($keyword)
    {
        return self::$api->search($keyword, ['album', 'artist', 'playlist']);
    }

    private function _getDevice()
    {
        $device = self::$api->getMyDevices();
        foreach ($device->devices as $val) {
            array_push(self::$device, $val->id);
        }
    }
}
