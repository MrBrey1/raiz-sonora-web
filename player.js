// Lista de canciones con títulos y rutas correctas
const playlist = [
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

// DOM elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playlistElement = document.getElementById("playlist");

// Estado
let currentTrack = 0;

// Mostrar lista de canciones
function loadPlaylist() {
    playlist.forEach((track, index) => {
        const li = document.createElement("li");
        li.textContent = track.title;
        li.classList.add("track-item");
        
        li.addEventListener("click", () => {
            currentTrack = index;
            loadTrack();
            playAudio();
        });

        playlistElement.appendChild(li);
    });
}

// Cargar canción actual
function loadTrack() {
    audio.src = playlist[currentTrack].file;

    document
        .querySelectorAll(".track-item")
        .forEach((el, i) => {
            el.classList.toggle("active-track", i === currentTrack);
        });
}

// Reproducir
function playAudio() {
    audio.play();
    playPauseBtn.textContent = "⏸️";
}

// Pausar
function pauseAudio() {
    audio.pause();
    playPauseBtn.textContent = "▶️";
}

// Botón play/pause
playPauseBtn.addEventListener("click", () => {
    if (audio.paused) playAudio();
    else pauseAudio();
});

// Botón siguiente
nextBtn.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack();
    playAudio();
});

// Botón anterior
prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack();
    playAudio();
});

// Cuando termina la canción → pasa a la siguiente
audio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack();
    playAudio();
});

// Inicializar reproductor
loadPlaylist();
loadTrack();
