// =====================================================
// RAÍZ SONORA - RADIO / PLAYER (multi-playlist + covers)
// - 4 playlists internas (álbumes)
// - portada por álbum
// - carga por URL ?pl=ecos-de-calma (sin autoplay)
// - recuerda última playlist/track (localStorage)
// =====================================================

// =======================
// CONFIG: PLAYLISTS
// =======================
const PLAYLISTS = {
  "reflexiones": {
    name: "Reflexiones",
    cover: "img/albums/reflexiones.png",
    tracks: [
      { title: "Cuando la vida pesa, tú pesas más", file: "audio/reflexiones/cuando-la-vida-pesa-tu-pesas-mas.mp3" },
      { title: "El peso del sin sentido", file: "audio/reflexiones/el-peso-del-sin-sentido.mp3" },
      { title: "Juicio y circunstancias", file: "audio/reflexiones/juicio-y-circunstancias.mp3" },
      { title: "La vida, el tiempo y el existir", file: "audio/reflexiones/la-vida-el-tiempo-y-el-existir.mp3" },
      { title: "La vida sin manual", file: "audio/reflexiones/la-vida-sin-manual.mp3" },
      { title: "Luz, fortaleza y esperanza", file: "audio/reflexiones/luz-fortaleza-y-esperanza.mp3" },
      { title: "Sé justo, no bueno", file: "audio/reflexiones/se-justo-no-bueno.mp3" },
      { title: "Todo pasa, incluso la tormenta", file: "audio/reflexiones/todo-pasa-incluso-la-tormenta.mp3" }
    ]
  },

  "ecos-de-calma": {
    name: "Ecos de Calma",
    cover: "img/albums/ecos-de-calma.png",
    tracks: [
      // AJUSTA títulos/archivos si tus nombres reales difieren
      { title: "Apertura del Silencio", file: "audio/ecos-de-calma/apertura-del-silencio.mp3" },
      { title: "Abandonar la Tensión", file: "audio/ecos-de-calma/abandonar-la-tension.mp3" },
      { title: "Ritmo Sereno del Alma", file: "audio/ecos-de-calma/ritmo-sereno-del-alma.mp3" },
      { title: "Ecos que Sanan", file: "audio/ecos-de-calma/ecos-que-sanan.mp3" },
      { title: "Respiración y Presencia", file: "audio/ecos-de-calma/respiracion-y-presencia.mp3" },
      { title: "Transformación Interior", file: "audio/ecos-de-calma/transformacion-interior.mp3" },
      { title: "Coherencia del Corazón", file: "audio/ecos-de-calma/coherencia-del-corazon.mp3" },
      { title: "Ecos de Calma", file: "audio/ecos-de-calma/ecos-de-calma.mp3" }
    ]
  },

  "mantra-del-alma": {
    name: "Mantra del Alma",
    cover: "img/albums/mantra-del-alma.png",
    tracks: [
      // AJUSTA según tus archivos reales
      { title: "Puerta Interior", file: "audio/mantra-del-alma/puerta-interior.mp3" },
      { title: "Respira Conmigo", file: "audio/mantra-del-alma/respira-conmigo.mp3" },
      { title: "Dentro de la Luz", file: "audio/mantra-del-alma/dentro-de-la-luz.mp3" },
      { title: "Yo Soy Presencia", file: "audio/mantra-del-alma/yo-soy-presencia.mp3" },
      { title: "Regreso al Centro", file: "audio/mantra-del-alma/regreso-al-centro.mp3" }
    ]
  },

  "ritual-de-descanso": {
    name: "Ritual de Descanso",
    cover: "img/albums/ritual-de-descanso.png",
    tracks: [
      // AJUSTA según tus archivos reales
      { title: "Preparando el Descanso", file: "audio/ritual-de-descanso/preparando-el-descanso.mp3" },
      { title: "Respiración que Arrulla", file: "audio/ritual-de-descanso/respiracion-que-arrulla.mp3" },
      { title: "Soltar el Día", file: "audio/ritual-de-descanso/soltar-el-dia.mp3" },
      { title: "Cuerpo Pesado, Mente Quieta", file: "audio/ritual-de-descanso/cuerpo-pesado-mente-quieta.mp3" },
      { title: "Antes del Sueño", file: "audio/ritual-de-descanso/antes-del-sueno.mp3" },
      { title: "Sueño Profundo", file: "audio/ritual-de-descanso/sueno-profundo.mp3" }
    ]
  }
};

// Orden del selector (si existe)
const PLAYLIST_ORDER = ["ecos-de-calma", "mantra-del-alma", "reflexiones", "ritual-de-descanso"];

// =======================
// DOM
// =======================
const audio              = document.getElementById("audio");
const playPauseBtn       = document.getElementById("playPauseBtn");
const prevBtn            = document.getElementById("prevBtn");
const nextBtn            = document.getElementById("nextBtn");
const playlistEl         = document.getElementById("playlist");
const trackTitleEl       = document.getElementById("trackTitle");
const currentTimeEl      = document.getElementById("currentTime");
const durationEl         = document.getElementById("duration");
const progressContainer  = document.getElementById("progressContainer");
const progressBar        = document.getElementById("progress");

// (Opcional) estos IDs si ya los agregaste en HTML
const albumCoverImg      = document.getElementById("albumCover");      // <img id="albumCover">
const playlistNameEl     = document.getElementById("playlistName");    // <div id="playlistName"> (si lo quieres)

// (Opcional) selector de playlists si existe
const playlistSelectEl   = document.getElementById("playlistSelect");  // <select id="playlistSelect">

// =======================
// STATE
// =======================
const LS_KEY = "raizsonora_player_state_v1";

let currentPlaylistKey = "reflexiones";
let currentIndex = 0;
let isPlaying = false;
let userStartedPlayback = false; // para garantizar "no autoplay"

// =======================
// UTIL
// =======================
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getPlaylistFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("pl");
}

function safePlaylistKey(key) {
  if (!key) return null;
  return PLAYLISTS[key] ? key : null;
}

function getCurrentTracks() {
  return PLAYLISTS[currentPlaylistKey].tracks;
}

function saveState() {
  try {
    const state = {
      playlist: currentPlaylistKey,
      index: currentIndex,
      time: audio?.currentTime || 0
    };
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const key = safePlaylistKey(parsed.playlist);
    if (!key) return null;
    return {
      playlist: key,
      index: Number.isFinite(parsed.index) ? parsed.index : 0,
      time: Number.isFinite(parsed.time) ? parsed.time : 0
    };
  } catch (_) {
    return null;
  }
}

// =======================
// UI BUILDERS
// =======================
function buildPlaylist() {
  const tracks = getCurrentTracks();
  playlistEl.innerHTML = "";

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.classList.add("track-item");
    li.textContent = track.title;
    li.dataset.index = String(index);

    li.addEventListener("click", () => {
      currentIndex = index;
      loadTrack({ keepTime: false, fromUser: true });
      // NO autoplay al cambiar de tema si no han dado play todavía
      if (isPlaying) playTrack();
      saveState();
    });

    playlistEl.appendChild(li);
  });

  markActiveTrack();
}

function markActiveTrack() {
  document.querySelectorAll(".track-item").forEach((li, i) => {
    li.classList.toggle("active-track", i === currentIndex);
  });
}

function updatePlaylistHeaderAndCover() {
  const pl = PLAYLISTS[currentPlaylistKey];

  if (playlistNameEl) playlistNameEl.textContent = pl.name;

  if (albumCoverImg) {
    albumCoverImg.src = pl.cover;
    albumCoverImg.alt = `Portada del álbum ${pl.name}`;
  }
}

function buildPlaylistSelectIfExists() {
  if (!playlistSelectEl) return;

  playlistSelectEl.innerHTML = "";
  const keys = PLAYLIST_ORDER.filter(k => PLAYLISTS[k]).concat(
    Object.keys(PLAYLISTS).filter(k => !PLAYLIST_ORDER.includes(k))
  );

  keys.forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = PLAYLISTS[key].name;
    playlistSelectEl.appendChild(opt);
  });

  playlistSelectEl.value = currentPlaylistKey;

  playlistSelectEl.addEventListener("change", () => {
    const key = safePlaylistKey(playlistSelectEl.value);
    if (!key) return;
    loadPlaylist(key, { fromUser: true });
  });
}

// =======================
// CORE: LOAD PLAYLIST/TRACK
// =======================
function loadPlaylist(key, opts = {}) {
  const nextKey = safePlaylistKey(key);
  if (!nextKey) return;

  currentPlaylistKey = nextKey;
  currentIndex = 0;

  // Si cambió por URL o por usuario, no dispares autoplay
  if (opts.fromUser) userStartedPlayback = userStartedPlayback; // no cambia

  updatePlaylistHeaderAndCover();
  buildPlaylist();

  // carga primera pista pero NO reproduce
  loadTrack({ keepTime: false, fromUser: false });

  if (playlistSelectEl) playlistSelectEl.value = currentPlaylistKey;

  // Actualiza la URL sin recargar (opcional)
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("pl", currentPlaylistKey);
    window.history.replaceState({}, "", url.toString());
  } catch (_) {}

  saveState();
}

function loadTrack({ keepTime = false, fromUser = false } = {}) {
  const tracks = getCurrentTracks();
  const track = tracks[currentIndex];
  if (!track) return;

  const prevTime = audio.currentTime || 0;

  audio.src = track.file;
  trackTitleEl.textContent = track.title;
  markActiveTrack();

  // reset UI time/progress while metadata loads
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  progressBar.style.width = "0%";

  // When metadata loaded, optionally restore time (for resume)
  audio.onloadedmetadata = () => {
    if (keepTime && Number.isFinite(prevTime) && prevTime > 0) {
      audio.currentTime = Math.min(prevTime, audio.duration || prevTime);
    }
    if (fromUser) saveState();
  };
}

// =======================
// PLAY / PAUSE (no autoplay)
// =======================
function playTrack() {
  // Marca que el usuario inició reproducción (para políticas)
  userStartedPlayback = true;

  audio.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
  }).catch(() => {
    // Si el navegador bloquea reproducción, no rompas nada.
    isPlaying = false;
    playPauseBtn.textContent = "▶";
  });
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

// =======================
// EVENTS: CONTROLS
// =======================
playPauseBtn.addEventListener("click", () => {
  if (!audio.src) loadTrack();
  isPlaying ? pauseTrack() : playTrack();
});

prevBtn.addEventListener("click", () => {
  const tracks = getCurrentTracks();
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack({ keepTime: false, fromUser: true });
  if (isPlaying) playTrack(); // no autoplay si estaba pausado
  saveState();
});

nextBtn.addEventListener("click", () => {
  const tracks = getCurrentTracks();
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack({ keepTime: false, fromUser: true });
  if (isPlaying) playTrack();
  saveState();
});

// =======================
// EVENTS: TIME/PROGRESS
// =======================
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);

  if (!isNaN(duration) && duration > 0) {
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
  }

  // guarda progreso cada ~2s (light)
  if (userStartedPlayback && Math.floor(currentTime) % 2 === 0) saveState();
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  if (!isNaN(duration) && duration > 0) {
    audio.currentTime = (clickX / width) * duration;
    saveState();
  }
});

// cuando termina, siguiente (solo si estaba reproduciendo)
audio.addEventListener("ended", () => {
  const tracks = getCurrentTracks();
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack({ keepTime: false, fromUser: true });

  // Continúa reproduciendo SOLO si estaba en play
  if (isPlaying) playTrack();
  saveState();
});

// =======================
// INIT
// =======================
(function init() {
  // 1) playlist desde URL (páginas SEO)
  const urlPl = safePlaylistKey(getPlaylistFromURL());

  // 2) o desde estado guardado
  const saved = loadState();

  if (urlPl) {
    currentPlaylistKey = urlPl;
    currentIndex = 0;
    updatePlaylistHeaderAndCover();
    buildPlaylistSelectIfExists();
    buildPlaylist();
    loadTrack({ keepTime: false, fromUser: false }); // NO autoplay
    saveState();
    return;
  }

  if (saved) {
    currentPlaylistKey = saved.playlist;
    currentIndex = Math.max(0, Math.min(saved.index, PLAYLISTS[currentPlaylistKey].tracks.length - 1));
    updatePlaylistHeaderAndCover();
    buildPlaylistSelectIfExists();
    buildPlaylist();
    loadTrack({ keepTime: false, fromUser: false }); // NO autoplay
    // opcional: restaurar tiempo al darle play luego (sin autoplay)
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(saved.time) && saved.time > 0) {
        audio.currentTime = Math.min(saved.time, audio.duration || saved.time);
      }
    }, { once: true });
    return;
  }

  // default: reflexiones
  currentPlaylistKey = "reflexiones";
  currentIndex = 0;
  updatePlaylistHeaderAndCover();
  buildPlaylistSelectIfExists();
  buildPlaylist();
  loadTrack({ keepTime: false, fromUser: false }); // NO autoplay
  saveState();
})();

// =======================
// EXPOSE (optional)
// para que otras páginas puedan llamar loadPlaylist()
// =======================
window.loadPlaylist = loadPlaylist;
