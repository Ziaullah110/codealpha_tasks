const songs = [
  { title: "Dreams", artist: "Bensound", src: "https://www.bensound.com/bensound-music/bensound-dreams.mp3" },
  { title: "Energy", artist: "Bensound", src: "https://www.bensound.com/bensound-music/bensound-energy.mp3" },
  { title: "Sunny", artist: "Bensound", src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3" },
];

let currentSong = 0;
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  updatePlaylist();
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶️";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) playSong();
  else pauseSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
}

audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
}

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value * audio.duration) / 100;
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

audio.addEventListener("ended", nextSong); // autoplay next

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function updatePlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    if (index === currentSong) li.classList.add("active");
    li.addEventListener("click", () => {
      currentSong = index;
      loadSong(currentSong);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

// Load the first song initially
loadSong(currentSong);
