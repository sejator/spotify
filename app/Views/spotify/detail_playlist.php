<div class="widget-content widget-content-area mb-3">
    <div class="row">
        <div class="col-md-12">
            <h4>Detail Playlist</h4>
            <div class="text-right mb-3">
                <button data-id="home" class="btn btn-warning btn-back" title="Back"><i class="flaticon-back-1"></i> Back</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-sm table-custom">
                <thead>
                    <th>#</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    <?php foreach ($playlist->items as $key => $item) : ?>
                        <tr>
                            <td><?= $key + 1; ?></td>
                            <td>
                                <?= $item->track->name; ?> - <span><?= $item->track->artists[0]->name; ?></span>
                            </td>
                            <td><?= $item->track->album->name; ?></td>
                            <td>
                                <a href="javascript:void(0);" class="play" title="Play Musik" data-uri="<?= $item->track->uri ?>">
                                    <i class="fas fa-play text-primary fs-20"></i>
                                </a>
                                <input name="uris" type="hidden" value="<?= $item->track->uri ?>">
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>