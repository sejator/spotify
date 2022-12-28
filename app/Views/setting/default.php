<div class="statbox widget box box-shadow">
    <div class="widget-content widget-content-area mt-3">
        <div class="row">
            <div class="col-md-12">
                <h4>Setting Default Aplikasi</h4>
                <div class="text-right mb-3">
                    <button data-id="setting" class="btn btn-warning btn-back" title="Back"><i class="flaticon-back-1"></i> Back</button>
                </div>
                <div class="col-md-6">
                    <form id="form-default">
                        <div class="form-group">
                            <label for="nama_app">Nama Aplikasi</label>
                            <input type="text" class="form-control" id="nama_app" name="nama_app" value="<?= esc($setting->nama_app) ?>">
                        </div>
                        <div class="form-group">
                            <label for="kota">Lokasi (*Jadwal sholat)</label>
                            <select name="kota" id="kota" class="form-control pilih-lokasi">
                                <?php foreach ($lokasi as $lok) : ?>
                                    <option value="<?= $lok->id ?>" <?= $lok->id == $setting->kota ? 'selected' : ''; ?>><?= $lok->lokasi; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="jeda_adzan">Jeda Adzan (*Menit)</label>
                            <input type="number" class="form-control" id="jeda_adzan" name="jeda_adzan" min="1" max="10" value="<?= esc($setting->jeda_adzan) ?>">
                        </div>
                        <div class="form-group">
                            <label for="jeda_iklan">Jeda Iklan (*Detik)</label>
                            <input type="number" class="form-control" id="jeda_iklan" name="jeda_iklan" min="1" max="20" value="<?= esc($setting->jeda_iklan) ?>">
                        </div>
                        <div class="form-group">
                            <label>Status Adzan</label>
                            <div class="n-chk">
                                <label class="new-control new-radio radio-primary">
                                    <input type="radio" class="new-control-input" name="suara_adzan" value="1" <?= esc($setting->suara_adzan == 1) ? 'checked' : '' ?>>
                                    <span class="new-control-indicator"></span>Aktif
                                </label>
                                <label class="new-control new-radio radio-primary">
                                    <input type="radio" class="new-control-input" name="suara_adzan" value="0" <?= esc($setting->suara_adzan == 0) ? 'checked' : '' ?>>
                                    <span class="new-control-indicator"></span>Non Aktif
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Cek Informasi Spotify</label>
                            <div class="n-chk">
                                <label class="new-control new-radio radio-primary">
                                    <input type="radio" class="new-control-input" name="cek_info" value="1" <?= esc($setting->cek_info == 1) ? 'checked' : '' ?>>
                                    <span class="new-control-indicator"></span>Aktif
                                </label>
                                <label class="new-control new-radio radio-primary">
                                    <input type="radio" class="new-control-input" name="cek_info" value="0" <?= esc($setting->cek_info == 0) ? 'checked' : '' ?>>
                                    <span class="new-control-indicator"></span>Non Aktif
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Fitur Pencarian Lagu</label>
                            <div class="n-chk">
                                <label class="new-control new-radio radio-primary">
                                    <input type="radio" class="new-control-input" name="pencarian" value="1" <?= esc($setting->pencarian == 1) ? 'checked' : '' ?>>
                                    <span class="new-control-indicator"></span>Aktif
                                </label>
                                <label class="new-control new-radio radio-primary">
                                    <input type="radio" class="new-control-input" name="pencarian" value="0" <?= esc($setting->pencarian == 0) ? 'checked' : '' ?>>
                                    <span class="new-control-indicator"></span>Non Aktif
                                </label>
                            </div>
                        </div>
                        <div class="text-center">
                            <input type="hidden" name="updated_at" value="<?= date('Y-m-d H:i:s') ?>">
                            <button id="btn-setting" type="button" class="btn btn-button-7 mb-4">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(".pilih-lokasi").select2();
    $('#btn-setting').on('click', function(e) {
        let form = $('#form-default')
        e.preventDefault()
        form.validate({
            errorElement: "div",
            errorClass: "is-invalid",
            rules: {
                nama_app: "required",
                kota: "required",
                jeda_adzan: "required",
                jeda_iklan: "required",
                suara_adzan: "required",
                cek_info: "required",
            },
        });

        if (form.valid()) {
            $.ajax({
                type: 'post',
                url: `${SITE_URL}/home/setting`,
                data: $('form').serialize(),
                success: (respon) => {
                    if (respon.status) {
                        let data = JSON.parse(respon.data)
                        toast({
                            type: 'success',
                            title: 'Update Sukses',
                        })
                        if ($('#kota').val() != localStorage.getItem('kota')) {
                            localStorage.setItem('kota', data.kota)
                            updateJadwalSholat()
                        }
                        if (data.suara_adzan == 1) {
                            cek_info = true
                            div_adzan.text('Status Adzan Aktif')
                        } else {
                            cek_info = false
                            div_adzan.text('Status Adzan Non Aktif')
                        }

                        localStorage.setItem('suara_adzan', data.suara_adzan)
                        localStorage.setItem('jeda_adzan', data.jeda_adzan)
                        localStorage.setItem('jeda_iklan', data.jeda_iklan)
                        localStorage.setItem('cek_info', cek_info)

                    } else {
                        toast({
                            type: 'error',
                            title: 'Gagal',
                        })
                    }
                },
                error: (xhr, status, messages) => {
                    toast({
                        type: 'error',
                        title: messages,
                    })
                }
            })
        };
    })
</script>