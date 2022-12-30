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
  jadwal_sholat = null,
  uris = new Array(),
  sound = new Audio(),
  iklan = new Audio(),
  accessToken = readCookie('accessToken'),
  refreshToken = readCookie('refreshToken'),
  div_adzan = $('#info_adzan'),
  cek_info = false,
  valid_akun = true,
  status_device = false,
  status_repeat = 0,
  kota,
  suara_adzan,
  jeda_adzan,
  jeda_iklan,
  player,
  id_device

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

$(document).on('click', '.detail-album', function (e) {
  e.preventDefault()
  let id = $(this).data('id')
  getData('detail-album', id)
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

// kontrol musik
$(document).on('click', '.play', function () {
  $('input[type=hidden][name=uris]')
    .map(function (_, el) {
      uris.push($(el).val())
    })
    .get()

  let index = uris.indexOf($(this).next().val())
  Promise.resolve(
    spotifyApi.play({
      device_id: id_device,
      uris: uris,
      offset: { position: index },
    })
  ).then((ok) => {
    uris = []
    cek_info = true
    status_device = true
  })
})

$(document).on('click', '.play-album', function () {
  let context = $(this).data('id')
  Promise.resolve(
    spotifyApi.play({ device_id: id_device, context_uri: context })
  ).then((res) => {
    uris = []
    cek_info = true
    status_device = true
  })
})

// tombol back khusus halaman admin
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
  pausePlaylist()
  blokElement('header')
  // stop dulu iklan yg berjalan
  iklan.pause()
  iklan.src = $(this).data('file')
  setTimeout(() => {
    console.log('Iklan play')
    iklan.play()
  }, 2000)
})

$(document).on('click', '.stop-iklan', function () {
  iklan.pause()
  resumePlaylist()
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

  // setting default tema
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

      localStorage.setItem('kota', data.setting.kota)
      localStorage.setItem('suara_adzan', data.setting.suara_adzan)
      localStorage.setItem('jeda_adzan', data.setting.jeda_adzan)
      localStorage.setItem('jeda_iklan', data.setting.jeda_iklan)
      localStorage.setItem('cek_info', false)

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
    refreshAccessToken()
    getInformations()
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
  blokElement('body, .navbar', '')
  $('header').block({
    message: '<h3>Adzan sedang berlangsung...</h3>',
  })
  pausePlaylist()
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function refreshAccessToken() {
  if (readCookie('refreshTime') == null && valid_akun == true) {
    $.get(`${SITE_URL}/auth/refresh`, function (token) {
      console.log('Token berhasil di refresh')
      spotifyApi.setAccessToken(token)
      // update token akses spotify
      //   player._options.getOAuthToken = (updateToken) => {
      //     updateToken(token)
      //   }
      player = new Spotify.Player({
        name: 'Spotify Web Player',
        getOAuthToken: (cb) => {
          cb(token)
        },
      })
    })
  }
}

// inisialisasi SDK web spotify
window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: 'Spotify Web Player',
    getOAuthToken: (cb) => {
      cb(accessToken)
    },
    volume: 0.5,
  })

  // Player Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id)
    id_device = device_id
    // setelah player siap, ganti ke device saat ini
    Promise.resolve(
      spotifyApi.transferMyPlayback([device_id], { play: false })
    ).then((val) => {
      unblokElement('header')
      console.log('device diganti', device_id)
    })
  })

  // sdk spotify gagal dimuat
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id)
    $('header').block({
      message: `<h4>Spotify gagal dimuat, silahkan refresh ulang dan pastikan terkoneksi internet!</h4>`,
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

  // auto play di blok browser
  player.addListener('autoplay_failed', () => {
    console.log('Autoplay is not allowed by the browser autoplay rules')
    $('header').block({
      message: `<h4>Putar otomatis gagal, silahkan ganti dan refresh ulang!</h4>`,
    })
  })

  // Token aksess tidak valid
  player.on('authentication_error', ({ message }) => {
    // console.error('Failed to authenticate', message)
    valid_akun = false
    cek_info = false
    $('header').block({
      message: '<h4>Token aksess tidak valid!</h4>',
    })
  })

  // Gagal memutar lagu
  player.on('playback_error', ({ message }) => {
    console.error('Failed to perform playback', message)
    $('header').block({
      message: `<h4>Gagal memutar lagu, silahkan refresh ulang!</h4>`,
    })
  })

  // event ketika pemutar musik berubah
  player.addListener('player_state_changed', (state) => {
    // ambil informasi musik yang terakhir di putar
    let track = null
    if (state == null) {
      Promise.resolve(spotifyApi.getMyRecentlyPlayedTracks()).then((result) => {
        //   console.log(result.items)
        track = result.items[0].track
        console.log('track', track)
        let artisnya = ''
        let link_artisnya = ''
        for (let i = 0; i < track.artists.length; i++) {
          artisnya = artisnya + track.artists[i].name
          link_artisnya += `<a href="javascript:void(0)" class="detail-artis text-white" data-id="${track.artists[i].id}" title="Detail Artis"><small>${track.artists[i].name}</small></a>`
          if (i != track.artists.length - 1) {
            artisnya = artisnya + ', '
            link_artisnya = link_artisnya + ' | '
          }
        }
        $('#info-play').text(`${track.name} - ${artisnya}`)
        $('#durasi').text(msToTime(track.duration_ms))
        $('#progress').prop('max', track.duration_ms)

        $('#info-gambar').prop('src', track.album.images[2].url)
        $('#info-artis').html(link_artisnya)
        $('#info-judul').html(
          `<a href="javascript:void(0)" class="detail-album text-white" data-id="${track.album.id}" title="Detail Album"><small class="text-white">${track.name}</small></a>`
        )
      })
    } else {
      track = state.track_window.current_track
      let artisnya = ''
      let link_artisnya = ''
      for (let i = 0; i < track.artists.length; i++) {
        artisnya = artisnya + track.artists[i].name
        link_artisnya += `<a href="javascript:void(0)" class="detail-artis text-white" data-id="${track.artists[i].uri}" title="Detail Artis"><small>${track.artists[i].name}</small></a>`
        if (i != track.artists.length - 1) {
          artisnya = artisnya + ', '
          link_artisnya = link_artisnya + ' | '
        }
      }
      $('#info-play').text(`${track.name} - ${artisnya}`)
      $('#durasi').text(msToTime(track.duration_ms))
      $('#progress').prop('max', track.duration_ms)

      $('#info-gambar').prop('src', track.album.images[1].url)
      $('#info-artis').html(link_artisnya)
      $('#info-judul').html(
        `<a href="javascript:void(0)" class="detail-album text-white" data-id="${track.album.uri}" title="Detail Album"><small class="text-white">${track.name}</small></a>`
      )
    }

    console.log(state)
    // cari lagu referensi setelah playlist next kosong
    if (
      state.position >= state.duration &&
      state.repeat_mode == 0 &&
      state.track_window.next_tracks.length == 0
    ) {
      let current_track = state.track_window.current_track.artists[0]
      let id_artis = current_track.uri.split(':')
      Promise.resolve(spotifyApi.getArtistRelatedArtists(id_artis[2])).then(
        (res) => {
          let index = getRandomInt(3)
          let context = res.artists[index].uri
          console.log(res.artists[index])

          setTimeout(() => {
            Promise.resolve(
              spotifyApi.play({ device_id: id_device, context_uri: context })
            )
              .then((result) => {
                console.log('Next cari lagu, play lagi')
              })
              .catch((error) => {
                //   console.log(error)
                Promise.resolve(
                  spotifyApi
                    .play({ device_id: id_device, context_uri: context })
                    .then((result) => {
                      console.log('Next cari lagu, play lagi')
                    })
                )
              })
          }, 1000)
        }
      )
    }
  })

  // mulai koneksi ke device
  player.connect().then((success) => {
    if (success) {
      console.log('Koneksi sukses!')
    }
  })
}

function getInformations() {
  if (cek_info) {
    player.getCurrentState().then((state) => {
      if (!state) {
        cek_info = false
        $('#animasi').addClass('d-none')
        console.error('User is not playing music through the Web Playback SDK')
        return
      }
      let current = state.track_window.current_track
      let artistSong = '',
        artis_link = ''

      for (let i = 0; i < current.artists.length; i++) {
        artis_link += `<a href="javascript:void(0)" class="detail-artis text-white" data-id="${current.artists[i].uri}" title="Detail Artis"><small>${current.artists[i].name}</small></a>`
        artistSong = artistSong + current.artists[i].name
        if (i != current.artists.length - 1) {
          artistSong = artistSong + ', '
          artis_link = artis_link + ' | '
        }
      }

      let info_musik = `${current.name} ~ ${artistSong} (${player._options.name})`
      $('#info-play').text(info_musik)
      $('title').text(info_musik)

      $('#info-gambar').prop('src', current.album.images[2].url)
      $('#info-artis').html(artis_link)
      $('#info-judul').html(
        `<a href="javascript:void(0)" class="detail-album text-white" data-id="${current.album.uri}" title="Detail Album"><small class="text-white">${current.name}</small></a>`
      )

      $('#durasi').text(msToTime(state.duration))
      $('#seek').text(msToTime(state.position))
      $('#progress').val(state.position).prop('max', state.duration)
      $('#animasi').removeClass('d-none')

      if (status_device) {
        status_device = true
        $('#play').hide()
        $('#pause').show()
        $('#animasi').removeClass('d-none')
      } else {
        status_device = false
        $('#play').show()
        $('#pause').hide()
        $('#animasi').addClass('d-none')
      }

      if (state.shuffle == true) {
        $('#random')
          .addClass('text-warning')
          .attr('data-original-title', 'Random Off')
      } else {
        $('#random')
          .removeClass('text-warning')
          .attr('data-original-title', 'Random On')
      }

      //   if (state.repeat_mode == 1) {
      //     $('#repeat')
      //       .removeClass('fa-redo fa-retweet text-white text-warning')
      //       .addClass('fa-recycle text-warning')
      //   } else if (state.repeat_mode == 2) {
      //     $('#repeat')
      //       .removeClass('fa-redo fa-recycle text-white text-warning')
      //       .addClass('fa-retweet text-warning')
      //   } else {
      //     $('#repeat')
      //       .removeClass('fa-recycle fa-retweet text-white text-warning')
      //       .addClass('fa-redo text-white')
      //   }

      // tandai lagu yang sedang diputar
      $('input[type=hidden][name=uris]')
        .map(function (_, el) {
          if ($(el).val() == current.uri && status_device) {
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
    })
  }
}

function toglePlaylist() {
  player.activateElement()
  player.togglePlay().then(() => {
    console.log('Toggled playback!')
    if ($('#pause').is(':hidden')) {
      cek_info = true
      status_device = true
      $('#play').hide()
      $('#pause').show()
      $('#animasi').removeClass('d-none')
    } else {
      cek_info = false
      status_device = false
      $('#play').show()
      $('#pause').hide()
      $('#animasi').addClass('d-none')
    }
  })
}

function resumePlaylist() {
  cek_info = true
  status_device = true
  unblokElement('header')
  $('#play').hide()
  $('#pause').show()
  $('#animasi').removeClass('d-none')
  player.resume().then(() => {
    console.log('Resumed!')
  })
}

function pausePlaylist() {
  cek_info = false
  status_device = false
  $('#play').show()
  $('#pause').hide()
  $('#animasi').addClass('d-none')
  player.pause().then(() => {
    console.log('Paused!')
  })
}

function playMusikLagi(timer) {
  ulang = true
  setTimeout(() => {
    if (cek_info == false) {
      unblokElement('body, header, .navbar')
      cek_info = true
      status_device = true
      player.resume().then(() => {
        console.log('Resumed!')
      })
    }
  }, timer)
}

function playlistPrevious() {
  player.previousTrack().then(() => {
    cek_info = true
    console.log('Set to previous track!')
  })
}

function playlistNext() {
  player.nextTrack().then(() => {
    cek_info = true
    console.log('Skipped to next track!')
  })
}

function playlistRandom() {
  if ($('#random').hasClass('text-warning')) {
    random = false
    setTimeout(() => {
      $('#random').removeClass('text-warning')
    }, 1000)
  } else {
    setTimeout(() => {
      $('#random').addClass('text-warning')
    }, 1000)
    random = true
  }
  Promise.resolve(spotifyApi.setShuffle(random, { device_id: id_device })).then(
    (res) => {
      console.log('random change')
    }
  )
}

function playlistRepeat() {
  if (status_repeat == 0) {
    repeat = 'context'
  } else if (status_repeat == 1) {
    repeat = 'track'
  } else {
    repeat = 'off'
  }
  //   Promise.resolve(spotifyApi.setRepeat(repeat)).then((result) => {
  //     console.log(result)
  //   })
}

function setProgres(time) {
  $('#seek').text(msToTime(time))
}

function setPositionTrack(time) {
  player.seek(time).then(() => {
    console.log('Changed position!')
  })
}

function setVolume(volume) {
  $('#info-volume').text(`Volume ${volume}%`)
  player.setVolume(volume / 100).then(() => {
    console.log('Volume updated!')
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
