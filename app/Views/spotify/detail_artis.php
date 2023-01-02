<div class="widget-content widget-content-area mb-3">
    <div class="row">
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12">
            <?php $image = isset($artis->images[0]) ? $artis->images[0]->url : base_url('assets/img/no-song.png'); ?>
            <div class="our-team-4">
                <div class="usr-profile">
                    <img src="<?= esc($image) ?>" alt="<?= $artis->name ?>">
                </div>
                <div class="team-content">
                    <div class="team-detail">
                        <h3 class="usr-name"><?= $artis->name ?></h3>
                    </div>
                    <div class="social-content">
                        <ul class="list-inline">
                            <li class="list-inline-item icon-twitter">
                                <a title="Play" class="play-album keterangan" href="javascript:void(0);" data-id="<?= esc($artis->uri); ?>"><i class="flaticon-next2"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12">
            <div class="text-right">
                <button data-id="home" class="btn btn-warning btn-back" title="Back"><i class="flaticon-back-1"></i> Back</button>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="table-responsive">
            <table class="table table-hover table-sm table-custom">
                <thead>
                    <th>#</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    <?php foreach ($playlist->tracks as $key => $item) : ?>
                        <tr>
                            <td><?= $key + 1; ?></td>
                            <td>
                                <?= $item->name; ?></span>
                            </td>
                            <td><?= $item->album->name ?></td>
                            <td>
                                <a title="Play" class="play" href="javascript:void(0);" data-id="<?= $item->uri; ?>"><i class="fas fa-play text-primary fs-20"></i></a>
                                <input name="uris" type="hidden" value="<?= $item->uri ?>">
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>