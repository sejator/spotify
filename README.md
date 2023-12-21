# Aplikasi Pemutar Musik (Spotify)
Aplikasi pemutar musik dari spotify ditambah fitur jadwal sholat, backsound dan iklan.

## Persyaratan
 - Semua persyaratan mengacu ke dokumentasi codeigniter 4. [Dokumentasi](https://codeigniter.com/user_guide/intro/requirements.html)

## Cara Install
 - Download projek ini. `git clone https://github.com/sejator/spotify.git`
 - Masuk ke direktori `cd spotify`
 - Jalankan `composer update` untuk mendownload dependensinya.
 - Ganti nama file `env-sampel` menjadi `.env`
 - Ubah kofigurasi databasenya :
    - `database.default.hostname = localhost`
    - `database.default.database = spotify`
    - `database.default.username = root`
    - `database.default.password = root`
    - `database.default.DBDriver = MySQLi`
 - Konfigurasi API key Spotify
    - Untuk lebih jelasnya bisa kunjungi di dokumentasi spotify [Web API Spotify](https://developer.spotify.com/documentation/web-api)
    - SPOTIFY_CLIENT_ID=xxx
    - SPOTIFY_CLIENT_SECRET=xx
    - SPOTIFY_REDIRECT_URI='http://localhost:8080/auth/callback' // harus sesuai dengan url yang di daftarkan di dashboard spotify
 - Buat nama database `spotify` kemudian import file `spotify-26-12-2023.sql`
 - Jalankan aplikasi `php spark serve` kemudian buka urlnya `http://localhost:8080/`
 - Akun untuk login :
    - Username : admin
    - Password : 123456
    - Catatan: digunakan untuk konfigurasi jadwal sholat, CRUD backsound, iklan dll.