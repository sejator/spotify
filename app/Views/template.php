<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <title>Spotify Web Player</title>
    <link rel="icon" type="image/x-icon" href="<?= base_url('favicon.ico') ?>" />
    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700' rel='stylesheet' type='text/css'>
    <link href="<?= base_url('assets/bootstrap/css/bootstrap.min.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/css/design-css/design.css') ?>" rel="stylesheet">
    <link href="<?= base_url('assets/css/plugins.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/css/loader.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/css/elements/team/team.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/font-icons/fontawesome/css/regular.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/font-icons/fontawesome/css/solid.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/font-icons/fontawesome/css/brands.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/font-icons/fontawesome/css/fontawesome.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/range_sliders/bs-sliders/bootstrap-slider.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/table/datatable/datatables.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/loaders/csspin.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/loaders/custom-loader.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/animate/animate.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/sweetalerts/sweetalert2.min.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/plugins/select2/select2.min.css') ?>" rel="stylesheet" type="text/css" />
    <link href="<?= base_url('assets/css/style.css') ?>" rel="stylesheet" type="text/css" />
</head>

<body onload="pageLoad()" data-url="<?= rtrim(site_url(), '/') ?>">
    <div id="eq-loader">
        <div class="eq-loader-div">
            <div class="eq-loading dual-loader mx-auto mb-5"></div>
        </div>
    </div>

    <!--  BEGIN NAVBAR  -->
    <header class="desktop-nav header navbar fixed-top">
        <div class="nav-logo">
            <a href="javascript:void(0);" class="nav-link sidebarCollapse d-inline-block mr-sm-5" data-placement="bottom">
                <i class="flaticon-menu-line-3"></i>
            </a>
        </div>

        <ul class="navbar-nav flex-row mr-auto">
            <li class="nav-item mr-lg-4 align-self-center">
                <a href="javascript:void(0);" class="nav-link text-white">
                    <i id="random" class="fas fa-random bs-tooltip" data-original-title="Random On" data-toggle="tooltip" data-placement="top" onclick="playlistRandom()"></i>
                </a>
            </li>
            <li class="nav-item ml-3 mr-lg-4 align-self-center">
                <a href="javascript:void(0);" class="nav-link">
                    <i id="repeat" class="fas fa-redo text-white bs-tooltip" data-original-title="Repeat" data-toggle="tooltip" data-placement="top" onclick="playlistRepeat()"></i>
                </a>
            </li>
            <li class="nav-item ml-3 mr-lg-4 align-self-center">
                <a href="javascript:void(0);" class="nav-link text-white">
                    <i id="stop" class="fas fa-stop bs-tooltip" data-original-title="Stop" data-toggle="tooltip" data-placement="top" onclick="playlistStop()"></i>
                </a>
            </li>
            <li class="nav-item ml-3 mr-lg-4 align-self-center">
                <a href="javascript:void(0);" class="nav-link text-white">
                    <i id="prev" class="fas fa-step-backward bs-tooltip" data-original-title="Previous" data-toggle="tooltip" data-placement="top" onclick="playlistPrevious()"></i>
                </a>
            </li>
            <li class="nav-item d-flex ml-3 mr-lg-4 align-self-center">
                <a href="javascript:void(0);" class="nav-link text-white">
                    <i id="play" class="fas fa-play bs-tooltip" data-original-title="Play" data-toggle="tooltip" data-placement="top" onclick="playlistPlay()"></i>
                </a>
                <a href="javascript:void(0);" class="nav-link text-white">
                    <i id="pause" class="fas fa-pause text-warning bs-tooltip" data-original-title="Pause" data-toggle="tooltip" data-placement="top" onclick="playlistPause()"></i>
                </a>
            </li>
            <li class="nav-item ml-3 mr-lg-4 align-self-center">
                <a href="javascript:void(0);" class="nav-link text-white">
                    <i id="next" class="fas fa-step-forward bs-tooltip" data-original-title="Next" data-toggle="tooltip" data-placement="top" onclick="playlistNext()"></i>
                </a>
            </li>
        </ul>

        <ul class="navbar-nav flex-row mr-auto" style="width: 50%;">
            <li class="nav-item mr-lg-2 align-self-center">
                <span class="text-white" id="seek">00:00</span>
            </li>
            <li class="nav-item align-self-center" style="width: 70%;">
                <div class="text-white">
                    <marquee scrolldelay="450" id="info-play" onmouseover="this.stop();" onmouseout="this.start();">Playlist not available!</marquee>
                </div>
                <input type="range" id="progress" style="width: 100%;" min="0" max="" value="0" oninput="onProgress(this.value)" onchange="setPositionTrack(this.value)">
            </li>
            <li class="nav-item ml-lg-2 align-self-center">
                <span class="text-white" id="durasi">00:00</span>
            </li>

            <li class="nav-item ml-lg-3 mr-2 align-self-center">
                <img id="info-gambar" style="max-height: 40px;" src="">
            </li>
            <li class="nav-item align-self-center" style="width: 25%;">
                <div>
                    <div id="info-judul"></div>
                    <div id="info-artis"></div>
                </div>
            </li>
        </ul>

        <ul class="navbar-nav flex-row ml-auto" style="width: 15%;">
            <li class="nav-item dropdown message-dropdown d-sm-block d-none align-self-center">
                <a href="javascript:void(0);" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="icon flaticon-computer-line text-white"></span>
                </a>
                <div class="dropdown-menu position-absolute p-0 eq-animated eq-fadeInUp">
                    <div id="list-device"></div>
                </div>
            </li>
            <li class="nav-item ml-3 align-self-center" style="width: 100%;">
                <div class="text-white" id="info-volume">Volume 50%</div>
                <input type="range" id="volume" style="width: 100%;" min="0" max="100" value="50" onchange="jedaVolume()" oninput="setVolume(this.value)">
            </li>
            <li class="nav-item ml-3 mr-3 align-self-center">
                <a title="Ganti Tema" href="javascript:void(0);" id="ganti-tema" class="nav-link text-white"></a>
            </li>
        </ul>

    </header>
    <!--  END NAVBAR  -->

    <!--  BEGIN MAIN CONTAINER  -->
    <div class="main-container" id="container">
        <!--  BEGIN MODERN  -->
        <div class="modernSidebar-nav header navbar">
            <div class="">
                <nav id="modernSidebar">
                    <ul class="menu-categories pl-0 m-0" id="topAccordion">
                        <li class="menu bs-tooltip" title="Home" data-toggle="tooltip" data-placement="right">
                            <a href="#home" class="dropdown-toggle">
                                <i class="flaticon-home-fill"></i>
                            </a>
                        </li>
                        <li class="menu bs-tooltip" title="Setting" data-toggle="tooltip" data-placement="right">
                            <a href="#setting" class="dropdown-toggle">
                                <i class="flaticon-settings-4"></i>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <!--  END MODERN  -->

        <!--  BEGIN CONTENT PART  -->
        <div id="content" class="main-content">
            <div class="container">
                <div class="row mb-3">
                    <div class="col-lg-8 col-md-6 layout-spacing">
                        <div id="load-data"></div>
                    </div>
                    <div class="col-lg-4">
                        <?= $this->renderSection('konten'); ?>
                    </div>
                </div>
            </div>
        </div>
        <!--  END CONTENT PART  -->

    </div>
    <!-- END MAIN CONTAINER -->

    <!--  BEGIN FOOTER  -->
    <footer class="footer-section theme-footer">
        <div class="footer-section-2 container-fluid">
            <div class="row">
                <div id="toggle-grid" class="col-xl-7 col-md-6 col-sm-6 col-12 text-sm-left text-center">
                    <ul class="list-inline links" style="margin-left: 5rem;">
                        <li class="list-inline-item">&copy; 2022 Spotify Music. All Rights Reserved.</li>
                    </ul>
                </div>
                <div class="col-xl-5 col-md-6 col-sm-6 col-12">
                    <ul class="list-inline mb-0 d-flex justify-content-sm-end justify-content-center mr-sm-3 ml-sm-0 mx-3">
                        <li class="list-inline-item align-self-center">
                            <div class="scrollTop"><i class="flaticon-up-arrow-fill-1"></i></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    <!--  END FOOTER  -->
    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <script src="<?= base_url('assets/js/libs/jquery-3.1.1.min.js') ?>"></script>
    <script src="<?= base_url('assets/js/loader.js') ?>"></script>
    <script src="<?= base_url('assets/bootstrap/js/popper.min.js') ?>"></script>
    <script src="<?= base_url('assets/bootstrap/js/bootstrap.min.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/scrollbar/jquery.mCustomScrollbar.concat.min.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/select2/select2.min.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/table/datatable/datatables.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/sweetalerts/sweetalert2.min.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/blockui/jquery.blockUI.min.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/range_sliders/bs-sliders/bootstrap-slider.js') ?>"></script>
    <script src="<?= base_url('assets/plugins/jquery-validate/jquery.validate.min.js') ?>"></script>

    <script src="<?= base_url('assets/js/app.js') ?>"></script>
    <script src="<?= base_url('assets/js/design-js/design.js') ?>"></script>
    <script src="<?= base_url('assets/js/custom.js') ?>"></script>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
    <script src="<?= base_url('assets/js/spotify-web-api.js') ?>"></script>
    <!-- custom script -->
    <script src="<?= base_url('assets/js/script.js') ?>"></script>
    <?= $this->renderSection('script'); ?>
</body>

</html>