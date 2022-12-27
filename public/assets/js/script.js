const SITE_URL = $('body').data('url'),
  adzan = new Audio(`${SITE_URL}/assets/adzan/adzan.mp3`),
  API_JADWAL = `https://api.myquran.com/v1/sholat/jadwal`,
  spotifyApi = new SpotifyWebApi(),
  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
  })

// default variabel
let ulang = true,
  progress = true,
  set_volume = true,
  jadwal_sholat = null,
  position_ms = 0,
  set_repeat = 'off',
  status_repeat = true,
  set_random = false,
  status_random = true,
  valid_akun = true,
  uris = new Array(),
  device = new Array(),
  sound = new Audio(),
  iklan = new Audio(),
  accessToken = readCookie('accessToken'),
  refreshToken = readCookie('refreshToken'),
  div_adzan = $('#info_adzan'),
  div_device = $('#list-device'),
  cek_info,
  kota,
  suara_adzan,
  jeda_adzan,
  jeda_iklan,
  player

// inisialisasi SDK web spotify
window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: 'Spotify Web Player',
    getOAuthToken: (callback) => {
      callback(accessToken)
    },
    volume: 0.5,
  })
  player.connect()
}

$('#ganti-tema').on('click', function (e) {
  e.preventDefault()
  if (localStorage.getItem('tema') == 'dark') {
    $(this).html(`<i class="fas fa-moon"></i>`)
    gantiTema('light')
  } else {
    $(this).html(`<i class="fas fa-sun"></i>`)
    gantiTema('dark')
  }
})

$('#modernSidebar ul li a').on('click', function (e) {
  e.preventDefault()
  let page = $(this).attr('href').replace('#', '')
  getData(page)
})

$(document).on('click', '.detail-playlist', function (e) {
  e.preventDefault()
  let id = $(this).data('id')
  getData('detail', id)
})

$(document).on('click', '.detail-artis', function (e) {
  e.preventDefault()
  let id = $(this).data('id')
  getData('detail-artis', id)
})

$(document).on('click', '.play', function () {
  uris.unshift($(this).next().val())
  $('input[type=hidden][name=uris]')
    .map(function (_, el) {
      uris.push($(el).val())
    })
    .get()

  device.forEach((id) => {
    Promise.resolve(spotifyApi.play({ device_id: id, uris: uris })).then(
      (res) => {
        cek_info = true
        console.log('play musik')
      }
    )
  })
})

$(document).on('click', '.play-album', function () {
  device.forEach((id) => {
    Promise.resolve(
      spotifyApi.play({ device_id: id, context_uri: $(this).data('id') })
    ).then((res) => {
      cek_info = true
      console.log('play musik')
    })
  })
})

$(document).on('click', '#btn-cari', function (e) {
  e.preventDefault()
  let cari = $('#cari').val()
  if (cari == '') {
    toast({
      type: 'warning',
      title: 'Keyword pencarian wajib diisi!',
    })
    $('#cari').focus()
    return false
  }
  $.ajax({
    url: `${SITE_URL}/home/getData`,
    data: {
      page: 'pencarian',
      param: cari,
    },
    beforeSend: () => {
      blokElement('#btn-cari, #detail-pencarian')
    },
    success: (respon) => {
      $('#detail-pencarian').html(respon)
      unblokElement('#btn-cari, #detail-pencarian')
      if (localStorage.getItem('tema') == 'dark') {
        $('.team-content').addClass('tema-dark')
      } else {
        $('.team-content').removeClass('tema-dark')
      }
    },
    error: (xhr, status, message) => {
      $('#detail-pencarian').html(message)
    },
  })
})

$(document).on('click', '.pause', function (e) {
  $(this)
    .children()
    .removeClass('fas fa-pause text-warning')
    .addClass('fas fa-play text-primary')
  playlistPause()
})

$(document).on('click', '.ganti-device', function () {
  Promise.resolve(spotifyApi.transferMyPlayback([$(this).data('id')])).then(
    (val) => {
      console.log('device diganti', val)
    }
  )
})

$(document).on('click', '.btn-back', function (e) {
  e.preventDefault()
  let page = $(this).data('id') == '' ? 'home' : $(this).data('id')
  getData(page)
})

// control backsound admin
$(document).on('click', '.play-sound', function (e) {
  e.preventDefault()
  console.log('sound play')
  sound.src = $(this).data('file')
  sound.play()
})

$(document).on('click', '.stop-sound', function () {
  console.log('sound stop')
  sound.pause()
})

$(document).on('click', '.delete-sound', function () {
  let id = $(this).data('id')
  $.ajax({
    type: 'post',
    url: `${SITE_URL}/home/hapusBacksound`,
    data: {
      id: id,
    },
    success: (res) => {
      tabel_sound.ajax.reload()
      toast({
        type: 'success',
        title: res.pesan,
      })
      setTimeout(() => {
        getData('backsound')
      }, 1300)
    },
  })
})

// control iklan admin
$(document).on('click', '.play-iklan', function () {
  blokElement('header')
  cek_info = false
  device.forEach((id) => {
    Promise.resolve(spotifyApi.pause({ device_id: id })).then((val) => {
      console.log('pause music')
    })
  })

  // stop dulu iklan yg berjalan
  iklan.pause()
  iklan.src = $(this).data('file')
  setTimeout(() => {
    $('#play').show()
    $('#pause').hide()
    console.log('Iklan play')
    iklan.play()
  }, 2000)
})

$(document).on('click', '.stop-iklan', function () {
  unblokElement('header')
  iklan.pause()
  device.forEach((id) => {
    Promise.resolve(spotifyApi.play({ device_id: id })).then((val) => {
      cek_info = true
      console.log('play musik lagi')
    })
  })
})

$(document).on('click', '.delete-iklan', function () {
  let id = $(this).data('id')
  $.ajax({
    type: 'post',
    url: `${SITE_URL}/home/hapusIklan`,
    data: {
      id: id,
    },
    success: (res) => {
      tabel_iklan.ajax.reload()
      toast({
        type: 'success',
        title: res.pesan,
      })
      setTimeout(() => {
        getData('iklan')
      }, 1300)
    },
  })
})

$(document).on('click', '#btn-logout', function () {
  $.ajax({
    type: 'post',
    url: `${SITE_URL}/home/logout`,
    success: (res) => {
      toast({
        type: 'success',
        title: 'Logout sukses',
      })
      setTimeout(() => {
        getData('setting')
      }, 1300)
    },
    error: (xhr, status, message) => {
      toast({
        type: 'error',
        title: message,
      })
    },
  })
})

// pertama kali halaman di load
function pageLoad() {
  App.init()
  tampilJam()
  tampilJadwalSholat()
  spotifyApi.setAccessToken(accessToken)

  // setting default pause hidden
  $('#pause').hide()

  // setting default tema (dark)
  localStorage.getItem('tema')
    ? gantiTema(localStorage.getItem('tema'))
    : gantiTema('dark')

  // default control musik blok dulu
  blokElement('header')

  fetch(`${SITE_URL}/home/setDefault`)
    .then((response) => response.json())
    .then((data) => {
      // seting default aplikasi
      kota = data.setting.kota
      suara_adzan = data.setting.suara_adzan
      jeda_adzan = data.setting.jeda_adzan
      jeda_iklan = data.setting.jeda_iklan
      cek_info = data.setting.cek_info

      localStorage.setItem('kota', data.setting.kota)
      localStorage.setItem('suara_adzan', data.setting.suara_adzan)
      localStorage.setItem('jeda_adzan', data.setting.jeda_adzan)
      localStorage.setItem('jeda_iklan', data.setting.jeda_iklan)
      localStorage.setItem('cek_info', data.setting.cek_info)

      if (data.setting.suara_adzan == 1) {
        div_adzan.text('Status Adzan Aktif')
      } else {
        div_adzan.text('Status Adzan Non Aktif')
      }
    })

  // ambil data
  let page =
    refreshToken == null
      ? (window.location.hash = 'auth')
      : (window.location.hash = 'home')
  getData(page)
}

function gantiTema(value) {
  localStorage.setItem('tema', value)
  if (value == 'dark') {
    $('#ganti-tema').html(`<i class="fas fa-sun"></i>`)
    $(
      '#container, .widget-content-area, .footer-section, .footer-section-2, .team-content'
    ).addClass('tema-dark')
  } else {
    $('#ganti-tema').html(`<i class="fas fa-moon"></i>`)
    $(
      '#container, .widget-content-area, .footer-section, .footer-section-2, .team-content'
    ).removeClass('tema-dark')
  }
}

function blokElement(el, text = 'spinner') {
  message = text == 'spinner' ? '<i class="flaticon-spinner-1 spin"></i>' : text
  $(`${el}`).block({
    message: message,
    overlayCSS: {
      backgroundColor: '#000',
      opacity: 0.8,
      cursor: 'wait',
    },
    css: {
      border: 0,
      color: '#fff',
      padding: 0,
      backgroundColor: 'transparent',
    },
  })
}

function unblokElement(el) {
  $(`${el}`).unblock()
}

function readCookie(name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toGMTString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60)
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return `${minutes}:${seconds}`
}

function tampilJam() {
  let date = new Date()
  let hour = updateTime(date.getHours())
  let min = updateTime(date.getMinutes())
  let sec = updateTime(date.getSeconds())
  document.getElementById('jam').innerText = hour + ' : ' + min + ' : ' + sec // tampil jam

  let year = date.getFullYear()
  let month = updateTime(date.getMonth() + 1)
  let curdate = updateTime(date.getDate())
  let tanggal = `${year}-${month}-${curdate}`

  jadwal_sholat = JSON.parse(localStorage.getItem('jadwal_sholat'))
  // untuk update jadwal sholat setiap pergantian tanggal
  if (jadwal_sholat == null || jadwal_sholat.data.jadwal.date != tanggal) {
    updateJadwalSholat()
  }

  suara_adzan = localStorage.getItem('suara_adzan')
  if (ulang && suara_adzan == 1) {
    // console.log('cek waktu adzan')
    waktuAdzan(`${hour}:${min}`)
  }

  jeda_adzan = parseInt(localStorage.getItem('jeda_adzan')) * (60 * 1000)
  adzan.addEventListener('ended', function () {
    // console.log('adzan end')
    // console.log(adzan.currentTime)
    $('header').block({
      message: `<h3>Jeda waktu adzan ${localStorage.getItem(
        'jeda_adzan'
      )} menit...</h3>`,
    })
    playMusikLagi(jeda_adzan)
  })

  jeda_iklan = parseInt(localStorage.getItem('jeda_iklan')) * 1000
  iklan.addEventListener('ended', function () {
    //   console.log('iklan end')
    //   console.log(iklan.currentTime)
    playMusikLagi(jeda_iklan)
  })

  setTimeout(function () {
    tampilJam()
    loopForever()
  }, 1000)
}

function updateTime(time) {
  if (time < 10) {
    return '0' + time
  } else {
    return time
  }
}

function waktuAdzan(waktu) {
  if (jadwal_sholat != null) {
    let data = jadwal_sholat.data
    switch (waktu) {
      case data.jadwal.subuh:
        playAdzan()
        break
      case data.jadwal.dzuhur:
        playAdzan()
        break
      case data.jadwal.ashar:
        playAdzan()
        break
      case data.jadwal.maghrib:
        playAdzan()
        break
      case data.jadwal.isya:
        playAdzan()
        break
      default:
        // silent
        break
    }
  }
}

function playAdzan() {
  console.log('Adzan play')
  ulang = false
  cek_info = false
  blokElement('body, .navbar', '')
  $('header').block({
    message: '<h3>Adzan sedang berlangsung...</h3>',
  })
  playlistPause()
  if (sound != undefined) sound.pause()
  if (iklan != undefined) iklan.pause()

  adzan.play()
}

function tampilJadwalSholat() {
  if (jadwal_sholat == null) {
    updateJadwalSholat()
  } else {
    let data = jadwal_sholat.data
    document.getElementById(
      'info_kota'
    ).innerText = `Jadwal Sholat ${data.lokasi}`
    document.getElementById('hari').innerText = data.jadwal.tanggal
    document.getElementById('subuh').innerText = data.jadwal.subuh
    document.getElementById('dzuhur').innerText = data.jadwal.dzuhur
    document.getElementById('ashar').innerText = data.jadwal.ashar
    document.getElementById('maghrib').innerText = data.jadwal.maghrib
    document.getElementById('isya').innerText = data.jadwal.isya
  }
}

function updateJadwalSholat() {
  let date = new Date()
  let tahun = date.getFullYear()
  let bulan = updateTime(date.getMonth() + 1)
  let tanggal = updateTime(date.getDate())

  kota = localStorage.getItem('kota') ? localStorage.getItem('kota') : 1219 // default kota bandung
  let url = `${API_JADWAL}/${kota}/${tahun}/${bulan}/${tanggal}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('jadwal_sholat', JSON.stringify(data))
      jadwal_sholat = JSON.parse(localStorage.getItem('jadwal_sholat'))
      tampilJadwalSholat()
      toast({
        type: 'success',
        title: 'Jadwal Sholat berhasil diupdate!',
      })
    })
}

function getData(page, param = '') {
  $.ajax({
    url: `${SITE_URL}/home/getData`,
    data: {
      page: page,
      param: param,
    },
    beforeSend: () => {
      blokElement(
        '#load-data',
        '<div class="text-center"><div class="cp-spinner cp-skeleton"></div></div>'
      )
    },
    success: (respon) => {
      $('html, body').animate({ scrollTop: 0 })
      $('#load-data').html(respon)
      window.location.hash = page

      if (localStorage.getItem('tema') == 'dark') {
        $('.widget-content-area, .team-content').addClass('tema-dark')
      } else {
        $('.widget-content-area, .team-content').removeClass('tema-dark')
      }
    },
    error: (xhr, status, message) => {
      $('#load-data').html(message)
    },
  })
}

// looping terus untuk ambil data dari spotify
function loopForever() {
  // sdk spotify ready
  player.addListener('ready', ({ device_id }) => {
    valid_akun = true
    unblokElement('header')
    console.log(`Spotify Music! Device ID`, device_id)
    Promise.resolve(spotifyApi.getMyDevices()).then((value) => {
      device = []
      for (const el of value.devices) {
        device.push(el.id)
      }
    })
  })

  // akun spotify masih free
  player.on('account_error', ({ message }) => {
    console.error('Failed to validate Spotify account', message)
    blokElement('#modernSidebar, #load-data', '')
    $('header').block({
      message: `<h3>Akun spotify masih free!</h3>`,
    })
  })

  // sdk spotify gagal dimuat
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id)
    $('header').block({
      message: `<h4>Spotify gagal dimuat, silahkan refresh ulang dan pastikan terkoneksi internet!</h4>`,
    })
  })

  // auto play di blok browser
  player.addListener('autoplay_failed', () => {
    console.log('Autoplay is not allowed by the browser autoplay rules')
    $('header').block({
      message: `<h4>Putar otomatis tidak diizinkan browser, silahkan ganti diizinkan!</h4>`,
    })
  })

  // Token aksess tidak valid
  player.on('authentication_error', ({ message }) => {
    // console.error('Failed to authenticate', message)
    valid_akun = false
  })

  // Gagal memutar lagu
  player.on('playback_error', ({ message }) => {
    console.error('Failed to perform playback', message)
    $('header').block({
      message: `<h4>Gagal memutar lagu, silahkan refresh ulang!</h4>`,
    })
  })

  // get info play musik
  if (cek_info == true) {
    Promise.resolve(spotifyApi.getMyCurrentPlaybackState(null))
      .then(function (val) {
        getInformations(val)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // auto refresh token expired
  refreshAccessToken()
}

function getInformations(response) {
  if (response != '') {
    let currentlyPlayingType = response.currently_playing_type
    let progressSong = response.progress_ms
    let lenghtSong = response.item.duration_ms
    let progressSongFormatted = msToTime(response.progress_ms)
    let lenghtSongFormatted = msToTime(response.item.duration_ms)
    let deviceName = response.device.name
    let deviceType = response.device.type
    let titleSong = response.item.name
    let artistSong = ''

    position_ms = response.progress_ms // update posisi terakhir play
    set_repeat = response.repeat_state // update status repeate
    set_random = response.shuffle_state // update status random/shuffle

    if (response.is_playing == true) {
      $('#play').hide()
      $('#pause').show()

      // informasi device yang terhubung
      div_device
        .parents('li')
        .find('a')
        .children('span')
        .removeClass('text-white')
        .addClass('text-warning')
      Promise.resolve(spotifyApi.getMyDevices()).then(function (res) {
        let device_aktif = ''
        let device_nonaktif = ''
        $.each(res.devices, function (i, val) {
          if (val.is_active) {
            device_aktif += `<a class="dropdown-item" id="device_aktif">
                <div class="">
                    <div class="media">
                        <div class="usr-img align-self-center mr-3">
                            <img src="${SITE_URL}/assets/img/audio-wave.webp">
                        </div>
                        <div class="media-body">
                            <div class="d-flex justify-content-between">
                                <p class="meta-user-name mr-3 mb-0 text-success">Sedang Aktif</p>
                            </div>
                            <p class="message-text mb-0 text-success">${val.name}</p>
                        </div>
                    </div>
                </div>
            </a>`
          } else {
            device_nonaktif += `<a class="dropdown-item ganti-device" data-id="${val.id}">
                <div class="">
                    <div class="media">
                        <div class="usr-img align-self-center mr-3">
                            <span class="icon flaticon-computer-5"></span>
                        </div>
                        <div class="media-body">
                            <div class="d-flex justify-content-between">
                                <p class="meta-user-name mr-3 mb-0">${val.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>`
          }
        })
        div_device.html(device_aktif)
        $('#device_aktif').parent().append(device_nonaktif)
      })
    } else {
      $('#play').show()
      $('#pause').hide()
      $('#info-play').text('Playlist not available!')
      $('title').text('Spotify Music')

      // informasi device yang terhubung
      div_device
        .parents('li')
        .find('a')
        .children('span')
        .removeClass('text-warning')
        .addClass('text-white')
      div_device.html('')
    }

    if (status_random) {
      if (response.shuffle_state == true) {
        $('#random')
          .addClass('text-warning')
          .attr('data-original-title', 'Random Off')
      } else {
        $('#random')
          .removeClass('text-warning')
          .attr('data-original-title', 'Random On')
      }
    }

    if (status_repeat) {
      if (response.repeat_state == 'track') {
        $('#repeat')
          .removeClass('fa-redo fa-recycle text-white text-warning')
          .addClass('fa-retweet text-warning')
      } else if (response.repeat_state == 'context') {
        $('#repeat')
          .removeClass('fa-redo fa-retweet text-white text-warning')
          .addClass('fa-recycle text-warning')
      } else {
        $('#repeat')
          .removeClass('fa-recycle fa-retweet text-white text-warning')
          .addClass('fa-redo text-white')
      }
    }

    if (currentlyPlayingType != 'ad') {
      for (let i = 0; i < response['item']['artists'].length; i++) {
        artistSong = artistSong + response['item']['artists'][i].name
        if (i != response['item']['artists'].length - 1) {
          artistSong = artistSong + ', '
        }
      }

      let info_musik = `${titleSong} - ${artistSong} (Device ~ ${deviceType})`
      $('#info-play').text(info_musik)
      $('title').text(info_musik)

      if (progress) {
        $('#durasi').text(lenghtSongFormatted)
        $('#seek').text(progressSongFormatted)
        $('#progress').val(progressSong).prop('max', lenghtSong)
      }

      if (set_volume) {
        $('#info-volume').text(`Volume ${response.device.volume_percent}%`)
        $('#volume').val(response.device.volume_percent)
      }
    }

    // tandai lagu yang sedang diputar
    $('input[type=hidden][name=uris]')
      .map(function (_, el) {
        if ($(el).val() == response.item.uri && response.is_playing == true) {
          $(el).parents('tr').addClass('musik-play')
          $(el).prev().removeClass('play').addClass('pause')

          $(el)
            .prev()
            .children()
            .removeClass('fas fa-play text-primary')
            .addClass('fas fa-pause text-warning')
        } else {
          $(el).parents('tr').removeClass('musik-play')
          $(el).prev().removeClass('pause').addClass('play')

          $(el)
            .prev()
            .children()
            .removeClass('fas fa-pause text-warning')
            .addClass('fas fa-play text-primary')
        }
      })
      .get()
  }
}

function refreshAccessToken() {
  if (readCookie('refreshTime') == null && valid_akun == true) {
    $.get(`${SITE_URL}/auth/refresh`, function (token) {
      console.log('Token berhasil di refresh')
      spotifyApi.setAccessToken(token)
      // update token akses spotify
      player._options.getOAuthToken = (updateToken) => {
        updateToken(token)
      }
    })
  }
}

function playlistPlay() {
  $('#play').hide()
  $('#pause').show()
  console.log('play musik')
  cek_info = true
  Promise.resolve(spotifyApi.getMyRecentlyPlayedTracks()).then((val) => {
    let recent = val.items[0]
    device.forEach((id) => {
      if (position_ms == 0) {
        uris.push(recent.track.uri)
        Promise.resolve(spotifyApi.play({ device_id: id, uris: uris }))
      } else {
        Promise.resolve(spotifyApi.play({ device_id: id }))
      }
    })
  })
}

function playlistPause() {
  device.forEach((id) => {
    Promise.resolve(spotifyApi.pause({ device_id: id })).then((val) => {
      console.log('pause musik')
      cek_info = false
      $('#pause').hide()
      $('#play').show()
    })
  })
}

function playMusikLagi(timer) {
  ulang = true
  setTimeout(() => {
    cek_info = true
    unblokElement('body, header, .navbar')
    device.forEach((id) => {
      Promise.resolve(spotifyApi.play({ device_id: id }))
    })
  }, timer)
}

function playlistStop() {
  cek_info = false
  device.forEach((id) => {
    Promise.resolve(spotifyApi.pause({ device_id: id })).then((res) => {
      console.log('stop musik')
      position_ms = 0
      $('#pause').hide()
      $('#play').show()
      $('#seek').text('00:00')
      $('#durasi').text('00:00')
      $('#progress').val(0).prop('max', 0)
      $('#info-play').text('Playlist not available!')
      $('title').text('Spotify Music')

      // informasi device yang terhubung
      div_device
        .parents('li')
        .find('a')
        .children('span')
        .removeClass('text-warning')
        .addClass('text-white')
      div_device.html('')
    })
  })
}

function playlistRandom() {
  status_random = false
  if (set_random) {
    random = false
    $('#random').removeClass('text-warning')
  } else {
    $('#random').addClass('text-warning')
    random = true
  }

  device.forEach((id) => {
    Promise.resolve(spotifyApi.setShuffle(random, { device_id: id })).then(
      (res) => {
        console.log('random change', res)
        setTimeout(() => {
          status_random = true
        }, 500)
      }
    )
  })
}

function playlistRepeat() {
  status_repeat = false
  if (set_repeat == 'off') {
    repeat = 'context'
    $('#repeat')
      .removeClass('fa-redo fa-retweet text-white text-warning')
      .addClass('fa-recycle text-warning')
  } else if (set_repeat == 'context') {
    repeat = 'track'
    $('#repeat')
      .removeClass('fa-redo fa-recycle text-white text-warning')
      .addClass('fa-retweet text-warning')
  } else {
    repeat = 'off'
    $('#repeat')
      .removeClass('fa-recycle fa-retweet text-white text-warning')
      .addClass('fa-redo text-white')
  }

  device.forEach((id) => {
    Promise.resolve(spotifyApi.setRepeat(repeat, { device_id: id })).then(
      (res) => {
        setTimeout(() => {
          status_repeat = true
        }, 500)
      }
    )
  })
}

function playlistPrevious() {
  device.forEach((id) => {
    Promise.resolve(spotifyApi.skipToPrevious({ device_id: id })).then(
      (res) => {
        console.log('previous playlist')
      }
    )
  })
}

function playlistNext() {
  device.forEach((id) => {
    Promise.resolve(spotifyApi.skipToNext({ device_id: id })).then((res) => {
      console.log('next playlist')
    })
  })
}

function onProgress(val) {
  progress = false
  $('#seek').text(msToTime(val))
}

function setPositionTrack(time) {
  device.forEach((id) => {
    Promise.resolve(spotifyApi.seek(time, { device_id: id })).then((res) => {
      console.log('posisi track')
      setTimeout(() => {
        progress = true
      }, 500)
    })
  })
}

function jedaVolume() {
  setTimeout(() => {
    set_volume = true
  }, 800)
}

function setVolume(volume) {
  set_volume = false
  $('#info-volume').text(`Volume ${volume}%`)
  device.forEach((id) => {
    Promise.resolve(spotifyApi.setVolume(volume, { device_id: id })).then(
      (res) => {
        console.log('volume update!')
      }
    )
  })
}

function setVolBacksound(vol) {
  $('#info-vol-sound').text(`${vol}%`)
  sound.volume = vol / 100
}

function setVolIklan(vol) {
  $('#info-vol-iklan').text(`${vol}%`)
  iklan.volume = vol / 100
}
