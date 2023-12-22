<!-- daftar playlist -->
<section>
    <div class="row">
        <div class="statbox widget box box-shadow">
            <div class="widget-content widget-content-area mb-3">
                <div class="row mb-3">
                    <div class="col-md-12">
                        <h4>Daftar Playlist</h4>
                    </div>
                </div>
                <div class="row">
                    <?php foreach ($playlist->items as $item) : ?>
                        <?php $image = isset($item->images[1]) ? $item->images[1]->url : base_url('assets/img/no-song.png'); ?>
                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                            <div class="our-team-4">
                                <div class="usr-profile keterangan">
                                    <a title="Detail Playlist" class="detail-playlist" href="javascript:void(0);" data-id="<?= esc($item->id); ?>">
                                        <img style="max-height: 180px;" src="<?= esc($image) ?>" alt="<?= esc($item->name); ?>">
                                    </a>
                                </div>
                                <div class="team-content">
                                    <div class="team-detail">
                                        <h3 class="usr-name"><?= $item->name; ?></h3>
                                    </div>
                                    <div class="social-content">
                                        <ul class="list-inline">
                                            <li class="list-inline-item icon-twitter">
                                                <a title="Play" class="play-album keterangan" href="javascript:void(0);" data-id="<?= esc($item->uri); ?>"><i class="flaticon-next2"></i></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- fitur pencarian lagu -->
    <?php if ($setting->pencarian == 1) : ?>
        <div class="row">
            <div class="statbox widget box box-shadow">
                <div class="widget-content widget-content-area mb-3">
                    <div class="row mb-3">
                        <div class="col-auto">
                            <h4>Mau Cari Lagu?</h4>
                        </div>
                        <div class="col-auto">
                            <form action="">
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" id="cari" placeholder="Ketik disini...">
                                    <div class="input-group-append">
                                        <button class="btn btn-info" type="submit" id="btn-cari">Cari</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="detail-pencarian">
                        <div class="row mb-3">
                            <?php foreach ($top->items as $item) : ?>
                                <?php $image = isset($item->images[0]) ? $item->images[0]->url : base_url('assets/img/no-song.png'); ?>
                                <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                                    <div class="our-team-4">
                                        <div class="usr-profile keterangan">
                                            <a title="Detail" class="detail-artis" href="javascript:void(0);" data-id="<?= esc($item->id); ?>">
                                                <img style="max-height: 180px;" src="<?= esc($image) ?>" alt="<?= esc($item->name); ?>">
                                            </a>
                                        </div>
                                        <div class="team-content">
                                            <div class="team-detail">
                                                <h3 class="usr-name"><?= character_limiter($item->name, 8); ?></h3>
                                            </div>
                                            <div class="social-content">
                                                <ul class="list-inline">
                                                    <li class="list-inline-item icon-twitter">
                                                        <a title="Play" class="play-album keterangan" href="javascript:void(0);" data-id="<?= esc($item->uri); ?>"><i class="flaticon-next2"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</section>