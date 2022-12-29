<?php

namespace App\Controllers;

use App\Models\SettingModel;
use Config\Services;
use SpotifyWebAPI\Session;
use SpotifyWebAPI\SpotifyWebAPI;

class Home extends BaseController {

    private $session, $setting, $clientID, $secretKey, $redirect;

    public function __construct() {
        helper(['cookie', 'text']);
        $this->clientID  = env('SPOTIFY_CLIENT_ID');
        $this->secretKey = env('SPOTIFY_CLIENT_SECRET');
        $this->redirect  = env('SPOTIFY_REDIRECT_URI');
        $this->session   = new Session($this->clientID, $this->secretKey, $this->redirect);
        $this->setting   = new SettingModel();
        $this->_setAccessToken();
    }

    public function index() {
        $data = [
            'backsound' => $this->setting->getBacksound(),
            'iklan'     => $this->setting->getIklan(),
        ];

        return view('index', $data);
    }

    public function datatable_iklan() {
        $param = [
            'draw'   => $this->request->getGet('draw', TRUE),
            'start'  => $this->request->getGet('start', TRUE),
            'length' => $this->request->getGet('length', TRUE),
            'search' => $this->request->getGet('search', TRUE)['value'],
            'order'  => $this->request->getGet('order', TRUE)[0]['column'], //kolom order
            'dir'    => $this->request->getGet('order', TRUE)[0]['dir'], //nilai order asc/desc
        ];
        $cek  = $this->setting->getIklanAjax($param);
        $data = [
            'data'            => $cek,
            'draw'            => intval($this->request->getGet('draw', TRUE)),
            'recordsTotal'    => count($cek),
            'recordsFiltered' => count($cek),
        ];

        return $this->response->setJSON($data);
    }

    public function datatable_sound() {
        $param = [
            'draw'   => $this->request->getGet('draw', TRUE),
            'start'  => $this->request->getGet('start', TRUE),
            'length' => $this->request->getGet('length', TRUE),
            'search' => $this->request->getGet('search', TRUE)['value'],
            'order'  => $this->request->getGet('order', TRUE)[0]['column'], //kolom order
            'dir'    => $this->request->getGet('order', TRUE)[0]['dir'], //nilai order asc/desc
        ];
        $cek  = $this->setting->getBacksoundAjax($param);
        $data = [
            'data'            => $cek,
            'draw'            => intval($this->request->getGet('draw', TRUE)),
            'recordsTotal'    => count($cek),
            'recordsFiltered' => count($cek),
        ];

        return $this->response->setJSON($data);
    }

    public function setDefault() {
        return $this->response->setJSON(['setting' => $this->setting->getSetting()]);
    }

    public function getData() {
        $page         = $this->request->getGet('page', FILTER_SANITIZE_SPECIAL_CHARS);
        $param        = $this->request->getGet('param');
        $refreshToken = get_cookie('refreshToken');

        switch ($page) {
        case 'auth':
        case 'home':
            if ($refreshToken == null) {
                return view('auth');
            } else {
                $setting          = $this->setting->getSetting();
                $data['setting']  = $setting;
                $data['playlist'] = Services::spotify()->playlist();
                if ($setting->pencarian == 1) {
                    $data['top'] = Services::spotify()->topArtis();
                }

                return view('home', $data);
            }
            break;

        case 'detail':
            return view('spotify/detail_playlist', [
                'playlist' => Services::spotify()->detailPlaylist($param),
            ]);
            break;

        case 'pencarian':
            return view('spotify/detail_pencarian', [
                'pencarian' => Services::spotify()->cari($param),
            ]);
            break;

        case 'detail-artis':
            $artis = Services::spotify()->detailArtis($param);

            return view('spotify/detail_artis', [
                'artis'    => $artis,
                'playlist' => Services::spotify()->artisTrack($artis->id),
            ]);
            break;
            
        case 'detail-album':
            return view('spotify/detail_album', [
                'album' => Services::spotify()->detailAlbum($param),
            ]);
            break;

        default:
            // halaman khusus untuk admin
            if (session()->get('login')) {
                switch ($page) {
                case 'setting':
                    return view('setting/index');
                    break;

                case 'default':
                    return view('setting/default', [
                        'setting' => $this->setting->getSetting(),
                        'lokasi'  => $this->setting->getLokasi(),
                    ]);
                    break;

                case 'backsound':
                    return view('setting/backsound', [
                        'backsound' => $this->setting->getBacksound(),
                    ]);
                    break;

                case 'iklan':
                    return view('setting/iklan', [
                        'iklan' => $this->setting->getIklan(),
                    ]);
                    break;

                default:
                    # silent
                    break;
                }
            } else {
                // login dulu
                return view('login');
            }
            break;
        }
    }

    public function login() {
        $username = $this->request->getPost('username', FILTER_SANITIZE_SPECIAL_CHARS);
        $password = $this->request->getPost('password');
        $cek      = $this->setting->validasiUser($username);

        if (empty($cek)) {
            $respon = [
                'status' => false,
                'pesan'  => 'Login gagal',
            ];
        } else {
            if (password_verify($password, $cek->password)) {
                session()->set('login', true);
                $respon = [
                    'status' => true,
                    'pesan'  => 'Login berhasil',
                ];
            } else {
                $respon = [
                    'status' => false,
                    'pesan'  => 'Login gagal',
                ];
            }
        }

        return $this->response->setJSON($respon);
    }

    public function setting() {
        $cek = $this->setting->updateSetting($this->request->getPost());

        return $this->response->setJSON(['status' => $cek, 'data' => json_encode($this->request->getPost())]);
    }

    public function uploadBacksound() {
        $rules = [
            'backsound' => 'uploaded[backsound]|max_size[backsound,500000]|ext_in[backsound,wav,mp3,aac,ogg]',
        ];

        if (!$this->validate($rules)) {
            $respon = [
                'status' => false,
                'pesan'  => $this->validator->getError('backsound'),
            ];
        } else {

            $file = $this->request->getFile('backsound');
            if ($file->isValid() && !$file->hasMoved()) {
                $namaFile = $file->getName();
                $size     = $file->getSize();
                $file->move(FCPATH . "/assets/backsound", $namaFile);
                $data = [
                    'file' => $file->getName(),
                    'size' => $size,
                ];
                $this->setting->uploadBacksound($data);
                $respon = [
                    'status' => true,
                    'pesan'  => $file->getName(),
                ];
            }
        }

        return $this->response->setJSON($respon);

    }

    public function hapusBacksound() {
        $id  = $this->request->getPost('id');
        $cek = $this->setting->getBacksound($id);

        if (!empty($cek)) {
            if (file_exists(FCPATH . "assets/backsound/$cek->file")) {
                unlink(FCPATH . "assets/backsound/$cek->file");
            }
            $this->setting->hapusBacksound($id);

            return $this->response->setJSON(['pesan' => 'File berhasil dihapus!']);
        }
    }

    public function uploadIklan() {
        $rules = [
            'iklan' => 'uploaded[iklan]|max_size[iklan,500000]|ext_in[iklan,wav,mp3,aac,ogg]',
        ];

        if (!$this->validate($rules)) {
            $respon = [
                'status' => false,
                'pesan'  => $this->validator->getError('iklan'),
            ];
        } else {

            $file = $this->request->getFile('iklan');
            if ($file->isValid() && !$file->hasMoved()) {
                $namaFile = $file->getName();
                $size     = $file->getSize();
                $file->move(FCPATH . "/assets/iklan", $namaFile);
                $data = [
                    'file' => $file->getName(),
                    'size' => $size,
                ];
                $this->setting->uploadIklan($data);
                $respon = [
                    'status' => true,
                    'pesan'  => $file->getName(),
                ];
            }
        }

        return $this->response->setJSON($respon);

    }

    public function hapusIklan() {
        $id  = $this->request->getPost('id');
        $cek = $this->setting->getIklan($id);

        if (!empty($cek)) {
            if (file_exists(FCPATH . "assets/iklan/$cek->file")) {
                unlink(FCPATH . "assets/iklan/$cek->file");
            }
            $this->setting->hapusIklan($id);

            return $this->response->setJSON(['pesan' => 'File berhasil dihapus!']);
        }
    }

    public function accessToken() {
        $state   = $this->session->generateState();
        $options = [
            'scope' => [
                'user-read-email',
                'user-read-private',
                'user-modify-playback-state',
                'user-read-playback-state',
                'user-read-currently-playing',
                'user-read-recently-played',
                'user-read-playback-position',
                'user-top-read',
                'user-library-read',
                'playlist-modify-public',
                'playlist-read-private',
                'playlist-modify-private',
                'streaming',
            ],
            'state' => $state,
        ];
        // setcookie('state', $state, time() + (3600 * 365), '/');
        // aktif 1 bulan
        set_cookie('state', $state, (3600 * 24 * 30), '', '/', '', false, false);
        $respon = [
            'status'   => true,
            'callback' => $this->session->getAuthorizeUrl($options),
        ];

        return $this->response->setJSON($respon);
    }

    public function callback() {
        $code = $this->request->getGet('code');
        // $state = $this->request->getGet('state');

        // if ($state != get_cookie('state')) {
        //     // The state returned isn't the same as the one we've stored, we shouldn't continue
        //     die('State mismatch');
        // }

        $this->session->requestAccessToken($code);
        $accessToken  = $this->session->getAccessToken();
        $refreshToken = $this->session->getRefreshToken();

        // setcookie('accessToken', $accessToken, time() + 3600, '/');
        // setcookie('refreshToken', $refreshToken, time() + (3600 * 365), '/');
        // setcookie('refreshTime', time() + 3300, time() + 3300, '/');

        $this->setCookieToken($accessToken, $refreshToken);

        return view('callback');
    }

    public function refresh() {
        $refreshToken = get_cookie('refreshToken');
        $this->session->refreshAccessToken($refreshToken);

        $api = new SpotifyWebAPI(['auto_refresh' => true], $this->session);
        $api->setSession($this->session);

        $accessToken  = $this->session->getAccessToken();
        $refreshToken = $this->session->getRefreshToken();

        $this->setCookieToken($accessToken, $refreshToken);
        $api->setAccessToken($accessToken);
        echo $accessToken;
    }

    public function logout() {
        // hapus semua session lama
        session()->remove('login');
        $generateSession = session()->get('__ci_last_regenerate');
        $timestamp       = date('Y-m-d H:i:s', $generateSession);
        $this->setting->deleteSession($timestamp);

        return $this->response->setJSON(true);
    }

    private function _setAccessToken() {
        $accessToken = get_cookie('accessToken');
        $refreshTime = get_cookie('refreshTime');

        if (get_cookie('refreshToken') == null) {
            return false;
        } else if (time() >= (int) $refreshTime || $refreshTime == null || $accessToken == null) {

            $this->session->refreshAccessToken(get_cookie('refreshToken'));
            $api = new SpotifyWebAPI(['auto_refresh' => true], $this->session);
            $api->setSession($this->session);
            $accessToken  = $this->session->getAccessToken();
            $refreshToken = $this->session->getRefreshToken();
            $this->setCookieToken($accessToken, $refreshToken);

            Services::spotify()->setToken($accessToken);
        } else {
            Services::spotify()->setToken(get_cookie('accessToken'));
        }
    }

    private function setCookieToken($accessToken, $refreshToken) {
        // bawaan php
        // setcookie('accessToken', $accessToken, time() + 3600, '/');
        // setcookie('refreshToken', $refreshToken, time() + (3600 * 365), '/');
        // setcookie('refreshTime', time() + 3300, time() + 3300, '/');

        // library dari codeigniter
        set_cookie('accessToken', $accessToken, 3600, '', '/', '', false, false);
        set_cookie('refreshToken', $refreshToken, (3600 * 24 * 30), '', '/', '', false, false);
        set_cookie('refreshTime', time() + 3300, 3300, '', '/', '', false, false);
    }
}
