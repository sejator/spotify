<?= $this->extend('template'); ?>
<?= $this->section('konten'); ?>
<div class="statbox widget box box-shadow">
    <div class="widget-content widget-content-area mb-3">
        <div class="row">
            <div class="col-md-12 text-center">
                <h4 id="info_kota"></h4>
                <span class="mx-2 waktu" id="hari"></span>
                <br>
                <span class="mx-2 waktu" id="jam"></span><span class="waktu">WIB</span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <table class="table table-bordered" style="margin-top: 10px;">
                    <tbody>
                        <tr>
                            <th>Subuh</th>
                            <th id="subuh">00:00</th>
                        </tr>
                        <tr>
                            <th>Dzuhur</th>
                            <th id="dzuhur">00:00</th>
                        </tr>
                        <tr>
                            <th>Ashar</th>
                            <th id="ashar">00:00</th>
                        </tr>
                        <tr>
                            <th>Maghrib</th>
                            <th id="maghrib">00:00</th>
                        </tr>
                        <tr>
                            <th>Isya</th>
                            <th id="isya">00:00</th>
                        </tr>
                    </tbody>
                </table>
                <div class="row mb-4">
                    <div class="col-sm-4">
                        <button class="btn btn-primary" onclick="updateJadwalSholat()">Update</button>
                    </div>
                    <div class="col-sm-8">
                        <span class="waktu" id="info_adzan"></span>
                    </div>
                </div>
                <span>Sumber : <i>https://bimasislam.kemenag.go.id/</i></span>
            </div>
        </div>
    </div>

    <div class="widget-content widget-content-area mb-3">
        <div class="row">
            <div class="col-md-12">
                <h4>Daftar Backsound</h4>
                <p>Set Volume Backsound</p>
                <div class="row">
                    <div class="col-sm-5">
                        <p>Volume <span id="info-vol-sound">100%</span></p>
                    </div>
                    <div class="col-sm-5">
                        <div class="slider" data-target="#vol-sound" data-role="slider" data-max-value="100" data-min-value="0" data-position="100"></div>
                    </div>
                </div>
                <input type="hidden" id="vol-sound" onchange="setVolBacksound(this.value)">
                <div class="table-responsive">
                    <table class="table tabel-sound">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="widget-content widget-content-area mb-3">
        <div class="row">
            <div class="col-md-12">
                <h4>Daftar Sound Iklan</h4>
                <p>Set Volume Iklan</p>
                <div class="row">
                    <div class="col-sm-5">
                        <p>Volume <span id="info-vol-iklan">100%</span></p>
                    </div>
                    <div class="col-sm-5">
                        <div class="slider" data-target="#vol-iklan" data-role="slider" data-max-value="100" data-min-value="0" data-position="100"></div>
                    </div>
                </div>
                <input type="hidden" id="vol-iklan" onchange="setVolIklan(this.value)">
                <div class="table-responsive">
                    <div class="table-responsive">
                        <table class="table tabel-iklan">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>
<?= $this->section('script'); ?>
<script>
    let tabel_sound = $(".tabel-sound").DataTable({
        serverSide: true,
        searching: false,
        ajax: {
            url: `${SITE_URL}/home/datatable_sound`,
        },
        columns: [{
                data: "file"
            },
            {
                data: function(row) {
                    let html = `<small class="d-flex"><a href="javascript:void(0)" class="play-sound mx-1" data-file="${SITE_URL}/assets/backsound/${row.file}"><span class="badge badge-info">Play</span></a>`;
                    html += `<a href="javascript:void(0)" class="stop-sound mx-1"><span class="badge badge-warning">Stop</span></a></small>`;
                    return html;
                }
            }
        ],
    });

    let tabel_iklan = $(".tabel-iklan").DataTable({
        serverSide: true,
        searching: false,
        ajax: {
            url: `${SITE_URL}/home/datatable_iklan`,
        },
        columns: [{
                data: "file"
            },
            {
                data: function(row) {
                    let html = `<small class="d-flex"><a href="javascript:void(0)" class="play-iklan mx-1" data-file="${SITE_URL}/assets/iklan/${row.file}"><span class="badge badge-info">Play</span></a>`;
                    html += `<a href="javascript:void(0)" class="stop-iklan mx-1"><span class="badge badge-warning">Stop</span></a></small>`;
                    return html;
                }
            }
        ],
    });
</script>
<?= $this->endSection(); ?>