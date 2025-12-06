// === PLAYLIST DE RAÍZ SONORA ===
const tracks = [
  {
    title: "Cuando la vida pesa, tú pesas más",
    file: "audio/cuando-la-vida-pesa-tu-pesas-mas.mp3"
  },
  {
    title: "El peso del sin sentido",
    file: "audio/el-peso-del-sin-sentido.mp3"
  },
  {
    title: "Juicio y circunstancias",
    file: "audio/juicio-y-circunstancias.mp3"
  },
  {
    title: "La vida, el tiempo y el existir",
    file: "audio/la-vida-el-tiempo-y-el-existir.mp3"
  },
  {
    title: "La vida sin manual",
    file: "audio/la-vida-sin-manual.mp3"
  },
  {
    title: "Luz, fortaleza y esperanza",
    file: "audio/luz-fortaleza-y-esperanza.mp3"
  },
  {
    title: "Sé justo, no bueno",
    file: "audio/se-justo-no-bueno.mp3"
  },
  {
    title: "Todo pasa, incluso la tormenta",
    file: "audio/todo-pasa-incluso-la-tormenta.mp3"
  }
];

// === ELEMENTOS DEL DOM ===
const audio           = document.getElementById("audio");
const playPauseBtn    = document.getElementById("playPauseBtn");
const prevBtn         = document.getElementById("prevBtn");
const nextBtn         = document.getElementById("nextBtn");
const playlistEl      = document.getElementById("playlist");
const trackTitleEl    = document.getElementById("trackTitle");
const currentTimeEl   = document.getElementById("currentTime");
const durationEl      = document.getElementById("duration");
const progressContainer = document.getElementById("progressContainer");
const progressBar     = document.getElementById("progress");

let currentIndex = 0;
let isPlaying = false;

// === UTILIDADES ===
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// === CONSTRUIR PLAYLIST EN HTML ===
function buildPlaylist() {
  playlistEl.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.classList.add("track-item");
    li.textContent = track.title;
    li.dataset.index = index;

    li.addEventListener("click", () => {
      currentIndex = index;
      loadTrack();
      playTrack();
    });

    playlistEl.appendChild(li);
  });
}

// === CARGAR PISTA ACTUAL ===
function loadTrack() {
  const track = tracks[currentIndex];
  audio.src = track.file;
  trackTitleEl.textContent = track.title;

  // marcar activa en la lista
  document.querySelectorAll(".track-item").forEach((li, i) => {
    li.classList.toggle("active-track", i === currentIndex);
  });
}

// === REPRODUCIR / PAUSAR ===
function playTrack() {
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸";
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

// === CONTROLES ===
playPauseBtn.addEventListener("click", () => {
  if (!audio.src) loadTrack();
  isPlaying ? pauseTrack() : playTrack();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack();
  playTrack();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack();
  playTrack();
});

// === PROGRESO Y TIEMPO ===
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);

  if (!isNaN(duration)) {
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
  }
});

// Seek al hacer click en la barra
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
});

// Cuando termina, pasa a la siguiente
audio.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack();
  playTrack();
});

// === INICIALIZAR ===
buildPlaylist();
loadTrack();
