const SITE_URL = $("body").data("url"),
  adzan = new Audio(`${SITE_URL}/assets/adzan/adzan-misyari-rasyid.mp3`),
  API_JADWAL = `https://jadwal-sholat-gilt.vercel.app/api/sholat/jadwal`,
  spotifyApi = new SpotifyWebApi(),
  toast = swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });

// default variabel
let ulang = true,
  jadwal_sholat = null,
  uris = new Array(),
  sound = new Audio(),
  iklan = new Audio(),
  div_adzan = $("#info_adzan"),
  cek_info = false,
  valid_akun = true,
  status_repeat = 0,
  id_device = null,
  kota,
  suara_adzan,
  jeda_adzan,
  jeda_iklan,
  player;

$("#ganti-tema").on("click", function (e) {
  e.preventDefault();
  if (localStorage.getItem("tema") == "dark") {
    $(this).html(`<i class="fas fa-moon"></i>`);
    gantiTema("light");
  } else {
    $(this).html(`<i class="fas fa-sun"></i>`);
    gantiTema("dark");
  }
});

$("#modernSidebar ul li a").on("click", function (e) {
  e.preventDefault();
  let page = $(this).attr("href").replace("#", "");
  getData(page);
});

$(document).on("click", ".detail-playlist", function (e) {
  e.preventDefault();
  let id = $(this).data("id");
  getData("detail", id);
});

$(document).on("click", ".detail-artis", function (e) {
  e.preventDefault();
  let id = $(this).data("id");
  getData("detail-artis", id);
});

$(document).on("click", ".detail-album", function (e) {
  e.preventDefault();
  let id = $(this).data("id");
  getData("detail-album", id);
});

$(document).on("click", "#btn-cari", function (e) {
  e.preventDefault();
  let cari = $("#cari").val();
  if (cari == "") {
    toast({
      type: "warning",
      title: "Keyword pencarian wajib diisi!",
    });
    $("#cari").focus();
    return false;
  }
  $.ajax({
    url: `${SITE_URL}/home/getData`,
    data: {
      page: "pencarian",
      param: cari,
    },
    beforeSend: () => {
      blokElement("#btn-cari, #detail-pencarian");
    },
    success: (respon) => {
      $("#detail-pencarian").html(respon);
      unblokElement("#btn-cari, #detail-pencarian");
      if (localStorage.getItem("tema") == "dark") {
        $(".team-content").addClass("tema-dark");
      } else {
        $(".team-content").removeClass("tema-dark");
      }
    },
    error: (xhr, status, message) => {
      $("#detail-pencarian").html(message);
    },
  });
});

// kontrol musik
$(document).on("click", ".play", function () {
  $("input[type=hidden][name=uris]")
    .map(function (_, el) {
      uris.push($(el).val());
    })
    .get();

  let index = uris.indexOf($(this).next().val());
  Promise.resolve(
    spotifyApi.play({
      device_id: id_device,
      uris: uris,
      offset: { position: index },
    })
  ).then((ok) => {
    uris = [];
    cek_info = true;
  });
});

$(document).on("click", ".play-album", function () {
  let context = $(this).data("id");
  Promise.resolve(spotifyApi.play({ device_id: id_device, context_uri: context })).then((res) => {
    uris = [];
    cek_info = true;
  });
});

// tombol back khusus halaman admin
$(document).on("click", ".btn-back", function (e) {
  e.preventDefault();
  let page = $(this).data("id") == "" ? "home" : $(this).data("id");
  getData(page);
});

// control backsound admin
$(document).on("click", ".play-sound", function (e) {
  e.preventDefault();
  console.log("sound play");
  sound.src = $(this).data("file");
  sound.play();
});

$(document).on("click", ".stop-sound", function () {
  console.log("sound stop");
  sound.pause();
});

$(document).on("click", ".delete-sound", function () {
  let id = $(this).data("id");
  $.ajax({
    type: "post",
    url: `${SITE_URL}/home/hapusBacksound`,
    data: {
      id: id,
    },
    success: (res) => {
      tabel_sound.ajax.reload();
      toast({
        type: "success",
        title: res.pesan,
      });
      setTimeout(() => {
        getData("backsound");
      }, 1300);
    },
  });
});

// control iklan admin
$(document).on("click", ".play-iklan", function () {
  pausePlaylist();
  // stop dulu iklan yg berjalan
  iklan.pause();
  iklan.src = $(this).data("file");
  setTimeout(() => {
    blokElement("section");
    $("header").block({
      message: `<h3>Lagi play iklan...</h3>`,
    });
    console.log("Iklan play");
    iklan.play();
  }, 2000);
});

$(document).on("click", ".stop-iklan", function () {
  iklan.pause();
  resumePlaylist();
});

$(document).on("click", ".delete-iklan", function () {
  let id = $(this).data("id");
  $.ajax({
    type: "post",
    url: `${SITE_URL}/home/hapusIklan`,
    data: {
      id: id,
    },
    success: (res) => {
      tabel_iklan.ajax.reload();
      toast({
        type: "success",
        title: res.pesan,
      });
      setTimeout(() => {
        getData("iklan");
      }, 1300);
    },
  });
});

$(document).on("click", "#btn-logout", function () {
  $.ajax({
    type: "post",
    url: `${SITE_URL}/home/logout`,
    success: (res) => {
      toast({
        type: "success",
        title: "Logout sukses",
      });
      setTimeout(() => {
        getData("setting");
      }, 1300);
    },
    error: (xhr, status, message) => {
      toast({
        type: "error",
        title: message,
      });
    },
  });
});

// pertama kali halaman di load
function pageLoad() {
  App.init();
  tampilJam();
  tampilJadwalSholat();
  spotifyApi.setAccessToken(readCookie("accessToken"));

  // setting default pause hidden
  $("#pause").hide();

  // setting default tema
  localStorage.getItem("tema") ? gantiTema(localStorage.getItem("tema")) : gantiTema("dark");

  // default control musik blok dulu
  blokElement("header");

  fetch(`${SITE_URL}/home/setDefault`)
    .then((response) => response.json())
    .then((data) => {
      // seting default aplikasi
      kota = data.setting.kota_id;
      suara_adzan = data.setting.suara_adzan;
      jeda_adzan = data.setting.jeda_adzan;
      jeda_iklan = data.setting.jeda_iklan;

      localStorage.setItem("kota", data.setting.kota_id);
      localStorage.setItem("suara_adzan", data.setting.suara_adzan);
      localStorage.setItem("jeda_adzan", data.setting.jeda_adzan);
      localStorage.setItem("jeda_iklan", data.setting.jeda_iklan);
      localStorage.setItem("cek_info", false);

      if (data.setting.suara_adzan == 1) {
        div_adzan.text("Status Adzan Aktif");
      } else {
        div_adzan.text("Status Adzan Non Aktif");
      }
    });

  // ambil data
  let page = readCookie("refreshToken") == null ? (window.location.hash = "auth") : (window.location.hash = "home");
  getData(page);
}

function gantiTema(value) {
  localStorage.setItem("tema", value);
  if (value == "dark") {
    $("#ganti-tema").html(`<i class="fas fa-sun"></i>`);
    $("#container, .widget-content-area, .footer-section, .footer-section-2, .team-content").addClass("tema-dark");
  } else {
    $("#ganti-tema").html(`<i class="fas fa-moon"></i>`);
    $("#container, .widget-content-area, .footer-section, .footer-section-2, .team-content").removeClass("tema-dark");
  }
}

function blokElement(el, text = "spinner") {
  let message = text == "spinner" ? '<i class="flaticon-spinner-1 spin"></i>' : text;
  $(`${el}`).block({
    message: message,
    overlayCSS: {
      backgroundColor: "#000",
      opacity: 0.8,
      cursor: "wait",
    },
    css: {
      border: 0,
      color: "#fff",
      padding: 0,
      backgroundColor: "transparent",
    },
  });
}

function unblokElement(el) {
  $(`${el}`).unblock();
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return `${minutes}:${seconds}`;
}

function tampilJam() {
  let date = new Date();
  let hour = updateTime(date.getHours());
  let min = updateTime(date.getMinutes());
  let sec = updateTime(date.getSeconds());
  document.getElementById("jam").innerText = hour + " : " + min + " : " + sec; // tampil jam

  let year = date.getFullYear();
  let month = updateTime(date.getMonth() + 1);
  let curdate = updateTime(date.getDate());
  let tanggal = `${year}-${month}-${curdate}`;

  jadwal_sholat = JSON.parse(localStorage.getItem("jadwal_sholat"));
  // untuk update jadwal sholat setiap pergantian tanggal
  if (jadwal_sholat == null || jadwal_sholat.data.jadwal.tanggal != tanggal) {
    updateJadwalSholat();
  }

  suara_adzan = localStorage.getItem("suara_adzan");
  if (ulang && suara_adzan == 1) {
    // console.log('cek waktu adzan')
    waktuAdzan(`${hour}:${min}`);
  }

  jeda_adzan = parseInt(localStorage.getItem("jeda_adzan")) * (60 * 1000);
  adzan.addEventListener("ended", function () {
    // console.log('adzan end')
    // console.log(adzan.currentTime)
    $("header").block({
      message: `<h3>Jeda waktu adzan ${localStorage.getItem("jeda_adzan")} menit...</h3>`,
    });
    playMusikLagi(jeda_adzan);
  });

  jeda_iklan = parseInt(localStorage.getItem("jeda_iklan")) * 1000;
  iklan.addEventListener("ended", function () {
    //   console.log('iklan end')
    //   console.log(iklan.currentTime)
    playMusikLagi(jeda_iklan);
  });

  setTimeout(function () {
    tampilJam();
    refreshAccessToken();
    getInformations();
  }, 1000);
}

function updateTime(time) {
  if (time < 10) {
    return "0" + time;
  } else {
    return time;
  }
}

function waktuAdzan(waktu) {
  if (jadwal_sholat != null) {
    let data = jadwal_sholat.data;
    switch (waktu) {
      case data.jadwal.subuh:
        playAdzan();
        break;
      case data.jadwal.dzuhur:
        playAdzan();
        break;
      case data.jadwal.ashar:
        playAdzan();
        break;
      case data.jadwal.maghrib:
        playAdzan();
        break;
      case data.jadwal.isya:
        playAdzan();
        break;
      default:
        // silent
        break;
    }
  }
}

function playAdzan() {
  console.log("Adzan play");
  ulang = false;
  blokElement("body, .navbar", "");
  pausePlaylist();
  if (sound != undefined) sound.pause();
  if (iklan != undefined) iklan.pause();

  setTimeout(() => {
    adzan.play();
    $("header").block({
      message: "<h3>Adzan sedang berlangsung...</h3>",
    });
  }, 1200);
}

function tampilJadwalSholat() {
  if (jadwal_sholat == null) {
    updateJadwalSholat();
  } else {
    let data = jadwal_sholat.data;
    // console.log(data);
    document.getElementById("info_kota").innerText = `Jadwal Sholat ${data.lokasi}`;
    document.getElementById("hari").innerText = `${data.hari}, ${data.tanggal} ${data.bulan} ${data.tahun}`;
    document.getElementById("subuh").innerText = data.jadwal.subuh;
    document.getElementById("dzuhur").innerText = data.jadwal.dzuhur;
    document.getElementById("ashar").innerText = data.jadwal.ashar;
    document.getElementById("maghrib").innerText = data.jadwal.maghrib;
    document.getElementById("isya").innerText = data.jadwal.isya;
  }
}

function updateJadwalSholat() {
  let date = new Date();
  let tahun = date.getFullYear();
  let bulan = updateTime(date.getMonth() + 1);
  let tanggal = updateTime(date.getDate());

  kota = localStorage.getItem("kota") ? localStorage.getItem("kota") : 14; // default kota bandung
  let url = `${API_JADWAL}/${kota}/${tahun}/${bulan}/${tanggal}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("jadwal_sholat", JSON.stringify(data));
      jadwal_sholat = JSON.parse(localStorage.getItem("jadwal_sholat"));
      tampilJadwalSholat();
      toast({
        type: "success",
        title: "Jadwal Sholat berhasil diupdate!",
      });
    });
}

function getData(page, param = "") {
  $.ajax({
    url: `${SITE_URL}/home/getData`,
    data: {
      page: page,
      param: param,
    },
    beforeSend: () => {
      blokElement("#load-data", '<div class="text-center"><div class="cp-spinner cp-skeleton"></div></div>');
    },
    success: (respon) => {
      $("html, body").animate({ scrollTop: 0 });
      $("#load-data").html(respon);
      window.location.hash = page;

      if (localStorage.getItem("tema") == "dark") {
        $(".widget-content-area, .team-content").addClass("tema-dark");
      } else {
        $(".widget-content-area, .team-content").removeClass("tema-dark");
      }
    },
    error: (xhr, status, message) => {
      $("#load-data").html(message);
    },
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function refreshAccessToken() {
  if (readCookie("refreshTime") == null && valid_akun == true) {
    $.ajax({
      url: `${SITE_URL}/auth/refresh`,
      success: (token) => {
        console.log("Token berhasil di refresh");
        spotifyApi.setAccessToken(token);
      },
      error: (xhr, status, message) => {
        console.log(message);
        valid_akun = false;
        cek_info = false;
        getData("auth");
      },
    });
  }
}

// inisialisasi SDK web spotify
window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: "Spotify Web Player",
    getOAuthToken: (callback) => {
      let setToken = readCookie("accessToken");
      callback(setToken);
    },
    volume: 0.5,
  });

  // Player Ready
  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
    id_device = device_id;
    // setelah player siap, ganti ke device saat ini
    Promise.resolve(spotifyApi.transferMyPlayback([device_id], { play: false })).then((val) => {
      console.log("device diganti", device_id);
    });
  });

  // sdk spotify gagal dimuat
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
    $("header").block({
      message: `<h4>Spotify gagal dimuat, silahkan refresh ulang dan pastikan terkoneksi internet!</h4>`,
    });
  });

  // akun spotify masih free
  player.on("account_error", ({ message }) => {
    console.error("Failed to validate Spotify account", message);
    blokElement("#modernSidebar, #load-data", "");
    $("header").block({
      message: `<h3>Akun spotify masih free!</h3>`,
    });
  });

  // auto play di blok browser
  player.addListener("autoplay_failed", () => {
    console.log("Autoplay is not allowed by the browser autoplay rules");
    $("header").block({
      message: `<h4>Putar otomatis gagal, silahkan refresh ulang atau (tekan CTRL + SHIFT + R)</h4>`,
    });
  });

  // Token aksess tidak valid
  player.on("authentication_error", ({ message }) => {
    // console.error('Failed to authenticate', message)
    valid_akun = false;
    cek_info = false;
    $("header").block({
      message: "<h4>Aksess Token tidak valid, silahkan login dulu!</h4>",
    });
  });

  // Gagal memutar lagu
  player.on("playback_error", ({ message }) => {
    console.error("Failed to perform playback", message);
    valid_akun = false;
    cek_info = false;
    $("header").block({
      message: `<h4>Gagal memutar musik, silahkan refresh ulang atau (tekan CTRL + SHIFT + R)</h4>`,
    });
  });

  // event ketika pemutar musik berubah
  player.addListener("player_state_changed", (state) => {
    // ambil informasi musik yang terakhir di putar
    if (state != null) {
      let track = state.track_window.current_track;
      let artisnya = "";
      let link_artisnya = "";
      for (let i = 0; i < track.artists.length; i++) {
        artisnya = artisnya + track.artists[i].name;
        link_artisnya += `<a href="javascript:void(0)" class="detail-artis text-white" data-id="${track.artists[i].uri}">${track.artists[i].name}</a>`;
        if (i != track.artists.length - 1) {
          artisnya = artisnya + ", ";
          link_artisnya = link_artisnya + ", ";
        }
      }

      setTimeout(() => {
        $("#durasi").text(msToTime(track.duration_ms));
        $("#progress").prop("max", track.duration_ms).val(state.position);
        $("#seek").text(msToTime(state.position));
        unblokElement("header");
      }, 1000);

      $("#info-gambar").data("id", track.album.uri).children().prop("src", track.album.images[1].url);

      let info_musik = `${track.name} ~ ${artisnya} (${player._options.name})`;
      $("title").text(info_musik);
      if (artisnya.length > 25) {
        $("#info-artis").html(
          `<marquee style="font-size: 0.8rem;" scrolldelay="450" id="info-play" onmouseover="this.stop();" onmouseout="this.start();">${link_artisnya}</marquee>`
        );
      } else {
        $("#info-artis").html(link_artisnya);
      }
      $("#info-play").html(`<a href="javascript:void(0)" class="detail-album text-white" data-id="${track.album.uri}">${track.name}</a>`);
    }

    // console.log(state)
    if (state.paused) {
      $("#play").show();
      $("#pause").hide();
      $("#animasi").addClass("d-none");
    } else {
      $("#play").hide();
      $("#pause").show();
      $("#animasi").removeClass("d-none");
    }
    // cari lagu referensi setelah playlist next kosong
    if (state.position == 0 && state.repeat_mode == 0 && state.paused && state.track_window.next_tracks.length == 0) {
      let current_track = state.track_window.current_track.artists[0];
      let id_artis = current_track.uri.split(":");
      Promise.resolve(spotifyApi.getArtistRelatedArtists(id_artis[2])).then((res) => {
        let index = getRandomInt(3);
        let context = res.artists[index].uri;
        setTimeout(() => {
          Promise.resolve(spotifyApi.play({ device_id: id_device, context_uri: context }))
            .then((result) => {
              console.log("Next cari lagu, play lagi");
            })
            .catch((error) => {
              //   console.log(error)
              Promise.resolve(
                spotifyApi.play({ device_id: id_device, context_uri: context }).then((result) => {
                  console.log("Next cari lagu, play lagi");
                })
              );
            });
        }, 1000);
      });
    }
  });

  // mulai koneksi ke device
  player.connect().then((success) => {
    if (success) {
      console.log("Koneksi sukses!");
    }
  });
};

function getInformations() {
  if (cek_info) {
    player.getCurrentState().then((state) => {
      if (!state) {
        cek_info = false;
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }
      let current = state.track_window.current_track;
      $("#seek").text(msToTime(state.position));
      $("#progress").val(state.position).prop("max", state.duration);

      // tandai lagu yang sedang diputar
      $("input[type=hidden][name=uris]")
        .map(function (_, el) {
          if ($(el).val() == current.uri && !state.paused) {
            $(el).parents("tr").addClass("musik-play");
            $(el).prev().removeClass("play").addClass("pause");

            $(el).prev().children().removeClass("fas fa-play text-primary").addClass("fas fa-pause text-warning");
          } else {
            $(el).parents("tr").removeClass("musik-play");
            $(el).prev().removeClass("pause").addClass("play");

            $(el).prev().children().removeClass("fas fa-pause text-warning").addClass("fas fa-play text-primary");
          }
        })
        .get();
    });
  }
}

function toglePlaylist() {
  player.activateElement();
  player.togglePlay().then(() => {
    console.log("Toggled playback!");
    if ($("#pause").is(":hidden")) {
      cek_info = true;
      $("#play").hide();
      $("#pause").show();
      $("#animasi").removeClass("d-none");
    } else {
      cek_info = false;
      $("#play").show();
      $("#pause").hide();
      $("#animasi").addClass("d-none");
    }
  });
}

function resumePlaylist() {
  cek_info = true;
  unblokElement("header");
  $("#play").hide();
  $("#pause").show();
  $("#animasi").removeClass("d-none");
  player.resume().then(() => {
    console.log("Resumed!");
  });
}

function pausePlaylist() {
  cek_info = false;
  $("#play").show();
  $("#pause").hide();
  $("#animasi").addClass("d-none");
  player.pause().then(() => {
    console.log("Paused!");
  });
}

function playMusikLagi(timer) {
  ulang = true;
  setTimeout(() => {
    if (cek_info == false) {
      unblokElement("body, header, .navbar, section");
      cek_info = true;
      player.resume().then(() => {
        console.log("Resumed!");
      });
    }
  }, timer);
}

function playlistPrevious() {
  player.previousTrack().then(() => {
    cek_info = true;
    console.log("Set to previous track!");
  });
}

function playlistNext() {
  player.nextTrack().then(() => {
    cek_info = true;
    console.log("Skipped to next track!");
  });
}

function playlistRandom() {
  if ($("#random").hasClass("text-warning")) {
    random = false;
    setTimeout(() => {
      $("#random").removeClass("text-warning");
    }, 1000);
  } else {
    setTimeout(() => {
      $("#random").addClass("text-warning");
    }, 1000);
    random = true;
  }
  Promise.resolve(spotifyApi.setShuffle(random, { device_id: id_device })).then((res) => {
    console.log("random change");
  });
}

function playlistRepeat() {
  if (status_repeat == 0) {
    repeat = "context";
  } else if (status_repeat == 1) {
    repeat = "track";
  } else {
    repeat = "off";
  }
  //   Promise.resolve(spotifyApi.setRepeat(repeat)).then((result) => {
  //     console.log(result)
  //   })
}

function setProgres(time) {
  $("#seek").text(msToTime(time));
}

function setPositionTrack(time) {
  player.seek(time).then(() => {
    console.log("Changed position!");
  });
}

function setVolume(volume) {
  $("#info-volume").text(`Volume ${volume}%`);
  player.setVolume(volume / 100).then(() => {
    console.log("Volume updated!");
  });
}

function setVolBacksound(vol) {
  $("#info-vol-sound").text(`${vol}%`);
  sound.volume = vol / 100;
}

function setVolIklan(vol) {
  $("#info-vol-iklan").text(`${vol}%`);
  iklan.volume = vol / 100;
}
