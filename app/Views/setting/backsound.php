<div class="statbox widget box box-shadow">
    <div class="widget-content widget-content-area mt-3">
        <div class="row mb-4">
            <div class="col-md-12">
                <h4>Daftar Backsoud</h4>
                <div class="text-right mb-3">
                    <button data-id="setting" class="btn btn-warning btn-back" title="Back"><i class="flaticon-back-1"></i> Back</button>
                </div>
                <div class="table-responsive">
                    <table class="table tabel-backsound">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($backsound as $key => $row) : ?>
                                <tr>
                                    <td><?= $key + 1; ?></td>
                                    <td><?= $row->file; ?></td>
                                    <td>
                                        <a href="javascript:void(0)" class="play-sound" data-file="<?= base_url("assets/backsound/$row->file") ?>"><span class="badge badge-info">Play</span></a>
                                        <a href="javascript:void(0)" class="stop-sound"><span class="badge badge-warning">Stop</span></a>
                                        <a href="javascript:void(0)" class="delete-sound" data-id="<?= $row->id ?>"><span class="badge badge-danger">Delete</span></a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-md-5">
                <h4>Upload File Backsound</h4>
                <form id="form-sound">
                    <div class="form-group">
                        <input type="file" class="form-control" id="backsound" name="backsound">
                    </div>
                    <div class="text-center">
                        <button id="btn-sound" type="button" class="btn btn-button-7 mb-4">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    $(".tabel-backsound").DataTable();

    $('#btn-sound').on('click', function(e) {
        let form = $('#form-sound')
        e.preventDefault()
        form.validate({
            errorElement: "div",
            errorClass: "is-invalid",
            rules: {
                backsound: "required",
            },
        });

        if (form.valid()) {
            let formData = new FormData(form[0]);
            $.ajax({
                type: 'post',
                url: `${SITE_URL}/home/uploadBacksound`,
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: (respon) => {
                    if (respon.status) {
                        tabel_sound.ajax.reload()
                        toast({
                            type: 'success',
                            title: `Upload file berhasil`,
                        })
                        setTimeout(() => {
                            getData('backsound')
                        }, 1300)
                    } else {
                        toast({
                            type: 'error',
                            title: respon.pesan,
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