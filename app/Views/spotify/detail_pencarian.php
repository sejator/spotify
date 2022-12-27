<div class="row mb-3">
    <div class="col-md-12">
        <h4>Albums</h4>
    </div>
</div>
<div class="row mb-3">
    <?php foreach ($pencarian->albums->items as $playlist) : ?>
        <?php $image = isset($playlist->images[1]) ? $playlist->images[1]->url : base_url('assets/img/no-song.png'); ?>
        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
            <div class="our-team-4">
                <div class="usr-profile keterangan">
                    <a class="detail-artis" href="javascript:void(0);" data-id="<?= esc($playlist->artists[0]->id); ?>">
                        <img style="max-height: 180px;" src="<?= esc($image) ?>" alt="<?= esc($playlist->name); ?>">
                    </a>
                </div>
                <div class="team-content">
                    <div class="team-detail">
                        <h3 class="usr-name"><?= character_limiter($playlist->name, 8); ?></h3>
                    </div>
                    <div class="social-content">
                        <ul class="list-inline">
                            <li class="list-inline-item icon-twitter">
                                <a title="Play" class="play-album keterangan" href="javascript:void(0);" data-id="<?= esc($playlist->uri); ?>"><i class="flaticon-next2"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<div class="row mb-3">
    <div class="col-md-12">
        <h4>Artist</h4>
    </div>
</div>
<div class="row mb-3">
    <?php foreach ($pencarian->artists->items as $artist) : ?>
        <?php $image = isset($artist->images[1]) ? $artist->images[1]->url : base_url('assets/img/no-song.png'); ?>
        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
            <div class="our-team-4">
                <div class="usr-profile keterangan">
                    <a class="detail-artis" href="javascript:void(0);" data-id="<?= esc($artist->id); ?>">
                        <img style="max-height: 180px;" src="<?= esc($image) ?>" alt="<?= esc($artist->name); ?>">
                    </a>
                </div>
                <div class="team-content">
                    <div class="team-detail">
                        <h3 class="usr-name"><?= character_limiter($artist->name, 8); ?></h3>
                    </div>
                    <div class="social-content">
                        <ul class="list-inline">
                            <li class="list-inline-item icon-twitter">
                                <a title="Play" class="play-album keterangan" href="javascript:void(0);" data-id="<?= esc($artist->uri); ?>"><i class="flaticon-next2"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<div class="row mb-3">
    <div class="col-md-12">
        <h4>Playlists</h4>
    </div>
</div>
<div class="row mb-3">
    <?php foreach ($pencarian->playlists->items as $playlist) : ?>
        <?php $image = isset($playlist->images[1]) ? $playlist->images[1]->url : base_url('assets/img/no-song.png'); ?>
        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
            <div class="our-team-4">
                <div class="usr-profile keterangan">
                    <a class="detail-playlist" href="javascript:void(0);" data-id="<?= esc($playlist->id); ?>">
                        <img style="max-height: 180px;" src="<?= esc($image) ?>" alt="<?= esc($playlist->name); ?>">
                    </a>
                </div>
                <div class="team-content">
                    <div class="team-detail">
                        <h3 class="usr-name"><?= character_limiter($playlist->name, 8); ?></h3>
                    </div>
                    <div class="social-content">
                        <ul class="list-inline">
                            <li class="list-inline-item icon-twitter">
                                <a title="Play" class="play-album keterangan" href="javascript:void(0);" data-id="<?= esc($playlist->uri); ?>"><i class="flaticon-next2"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>