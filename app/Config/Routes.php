<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('auth/callback', 'Home::callback');
$routes->get('auth/refresh', 'Home::refresh');

$routes->group('home', static function ($routes) {
    $routes->get('getData', 'Home::getData');
    $routes->get('accessToken', 'Home::accessToken');
    $routes->get('setDefault', 'Home::setDefault');
    $routes->get('datatable_iklan', 'Home::datatable_iklan');
    $routes->get('datatable_sound', 'Home::datatable_sound');
    $routes->get('sinkron', 'Home::sinkronLokasi');

    $routes->post('login', 'Home::login');
    $routes->post('logout', 'Home::logout');
    $routes->post('setting', 'Home::setting');
    $routes->post('uploadBacksound', 'Home::uploadBacksound');
    $routes->post('hapusBacksound', 'Home::hapusBacksound');
    $routes->post('uploadIklan', 'Home::uploadIklan');
    $routes->post('hapusIklan', 'Home::hapusIklan');
});
