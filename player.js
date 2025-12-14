// player.js — Radio Raíz Sonora (4 playlists internas)
// Funciona con tu HTML actual (botones, progreso, lista, etc.)

const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackTitle = document.getElementById("trackTitle");
const playlistEl = document.getElementById("playlist");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progressContainer = document.getElementById("progressContainer");
const progress = document.getElementById("progress");

// Tabs (4 playlists)
const tabs = document.querySelectorAll(".radio-tab");

// === Playlists (rutas a GitHub Pages) ===
const playlists = {
  ecos: [
    { title: "Apertura del Silencio", src: "/audio/ecos-de-calma/apertura-del-silencio.mp3" },
    { title: "Abandonar la tensión", src: "/audio/ecos-de-calma/abandonar-la-tension.mp3" },
    { title: "Ritmo Sereno Del Alma", src: "/audio/ecos-de-calma/ritmo-sereno-del-alma.mp3" },
    { title: "Ecos que Sanan", src: "/audio/ecos-de-calma/ecos-que-sanan.mp3" },
    { title: "Respiración y Presencia", src: "/audio/ecos-de-calma/respiracion-y-presencia.mp3" },
    { title: "Transformación interior", src: "/audio/ecos-de-calma/transformacion-interior.mp3" },
    { title: "Coherencia del corazón", src: "/audio/ecos-de-calma/coherencia-del-corazon.mp3" },
    { title: "Ecos de calma", src: "/audio/ecos-de-calma/ecos-de-calma.mp3" }
  ],

  ritual: [
    { title: "Preparando el Descanso", src: "/audio/ritual-de-descanso/preparando-el-descanso.mp3" },
    { title: "Respiración que Arrulla", src: "/audio/ritual-de-descanso/respiracion-que-arrulla.mp3" },
    { title: "Soltar el Día", src: "/audio/ritual-de-descanso/soltar-el-dia.mp3" },
    { title: "Cuerpo Pesado, Mente Ligera", src: "/audio/ritual-de-descanso/cuerpo-pesado-mente-ligera.mp3" },
    { title: "Antes del Sueño", src: "/audio/ritual-de-descanso/antes-del-sueno.mp3" },
    { title: "Sueño Profundo", src: "/audio/ritual-de-descanso/sueno-profundo.mp3" }
  ],

  mantra: [
    { title: "Puerta interior", src: "/audio/mantra-del-alma/puerta-interior.mp3" },
    { title: "Respira Conmigo", src: "/audio/mantra-del-alma/respira-conmigo.mp3" },
    { title: "Dentro de la luz", src: "/audio/mantra-del-alma/dentro-de-la-luz.mp3" },
    { title: "Yo soy presencia", src: "/audio/mantra-del-alma/yo-soy-presencia.mp3" },
    { title: "Regreso al centro", src: "/audio/mantra-del-alma/regreso-al-centro.mp3" }
  ],

  reflexiones: [
    { title: "Cuando la vida pesa, tú pesas más", src: "/audio/reflexiones/cuando-la-vida-pesa-tu-pesas-mas.mp3" },
    { title: "El peso del sinsentido", src: "/audio/reflexiones/el-peso-del-sinsentido.mp3" },
    { title: "Juicio y circunstancias", src: "/audio/reflexiones/juicio-y-circunstancias.mp3" },
    { title: "La vida, el tiempo y el existir", src: "/audio/reflexiones/la-vida-el-tiempo-y-el-existir.mp3" },
    { title: "La vida sin manual", src: "/audio/reflexiones/la-vida-sin-manual.mp3" },
    { title: "Luz, fortaleza y esperanza", src: "/audio/reflexiones/luz-fortaleza-y-esperanza.mp3" },
    { title: "Sé justo, no bueno", src: "/audio/reflexiones/se-justo-no-bueno.mp3" },
    { title: "Todo pasa, incluso la tormenta", src: "/audio/reflexiones/todo-pasa-incluso-la-tormenta.mp3" }
  ]
};

let currentPlaylistKey = "ecos";
let currentIndex = 0;
let isPlaying = false;

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function renderPlaylist() {
  const list = playlists[currentPlaylistKey] || [];
  playlistEl.innerHTML = "";

  list.forEach((track, idx) => {
    const li = document.createElement("li");
    li.textContent = track.title;
    li.className = "playlist-item" + (idx === currentIndex ? " active" : "");
    li.addEventListener("click", () => {
      loadTrack(idx);
      play();
    });
    playlistEl.appendChild(li);
  });
}

function setActiveItem() {
  const items = playlistEl.querySelectorAll(".playlist-item");
  items.forEach((el, idx) => {
    el.classList.toggle("active", idx === currentIndex);
  });
}

function loadTrack(index) {
  const list = playlists[currentPlaylistKey] || [];
  if (!list.length) return;

  currentIndex = (index + list.length) % list.length;
  const track = list[currentIndex];

  audio.src = track.src;
  trackTitle.textContent = track.title;

  setActiveItem();
}

function play() {
  audio.play().then(() => {
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
  }).catch(() => {});
}

function pause() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

function togglePlay() {
  if (!audio.src) loadTrack(currentIndex);
  if (isPlaying) pause();
  else play();
}

function next() {
  loadTrack(currentIndex + 1);
  play();
}

function prev() {
  loadTrack(currentIndex - 1);
  play();
}

// Progress bar
audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);

  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = (isFinite(percent) ? percent : 0) + "%";
});

progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const duration = audio.duration;
  if (!isFinite(duration)) return;
  audio.currentTime = (clickX / width) * duration;
});

// Auto next on end
audio.addEventListener("ended", () => next());

// Buttons
playPauseBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

// Tabs: switch playlist
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    btn.classList.add("active");

    currentPlaylistKey = btn.dataset.pl;
    currentIndex = 0;

    renderPlaylist();
    loadTrack(0);
    play();
  });
});

// Init
renderPlaylist();
loadTrack(0);
pause();


