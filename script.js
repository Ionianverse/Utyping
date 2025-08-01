// Theme audio
const THEME_SOUNDS = {
  space: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12c82c6b54.mp3',
  general: 'https://cdn.pixabay.com/audio/2022/12/19/audio_12c28e7ff4.mp3',
  science: 'https://cdn.pixabay.com/audio/2022/06/12/audio_12c1d8317c.mp3',
  biology: 'https://cdn.pixabay.com/audio/2022/11/16/audio_12e6e3387d.mp3',
  engineering: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12c83f28e1.mp3',
  ai: 'https://cdn.pixabay.com/audio/2022/11/16/audio_12e6e338f6.mp3'
};

// Theme background GIFs
const THEME_BACKGROUNDS = {
  space: "https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif",
  general: "https://media.giphy.com/media/3o7aD4VrGNwFJfJDOw/giphy.gif",
  science: "https://media.giphy.com/media/3oKIPtjElfqwMOTbH2/giphy.gif",
  biology: "https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif",
  engineering: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  ai: "https://media.giphy.com/media/hp3dmE3zWSs7u/giphy.gif"
};

// Dummy paragraphs per theme (for demo; you can load files via fetch if needed)
const THEMES = {
  space: ["The stars shine brightly.", "Welcome to the galaxy."],
  general: ["Practice makes perfect.", "Typing daily improves speed."],
  science: ["Gravity holds us down.", "Atoms form molecules."],
  biology: ["The heart pumps blood.", "Cells are life’s building blocks."],
  engineering: ["Machines solve problems.", "Bridges need strong foundations."],
  ai: ["Artificial intelligence is rising.", "Data drives machine learning."]
};

// Elements
const get = id => document.getElementById(id);
const textToTypeElement = get("challenge-text");
const input = get("typing-input");
const wpmDisplay = get("wpm");
const accuracyDisplay = get("accuracy");
const tierBadge = get("tier-badge");
const progressBar = get("progress-bar");
const levelInfo = get("level-info");
const nextBtn = get("next-btn");
const themeImage = get("theme-image");
const completedDisplay = get("completed");
const bestWPMDisplay = get("best-wpm");
const avgWPMDisplay = get("avg-wpm");
const bestAccuracyDisplay = get("best-accuracy");
const popupContainer = get("popup-container");
const popupStats = get("popup-stats");
const closePopupBtn = get("close-popup");
const timeSelect = get("practice-time-select");
const backgroundOverlay = get("background-overlay");

let currentTheme = "space";
let currentLevel = 1;
let tier = null;
let paragraph = "";
let startTime = null;
let totalErrors = 0;
let timer = null;
let timeLeft = 0;

let stats = {
  completed: 0,
  totalWPM: 0,
  totalAccuracy: 0,
  bestWPM: 0,
  bestAccuracy: 0
};

const tiers = [
  { name: "Mercury Novice", minLevel: 1, color: "#ffcc32" },
  { name: "Venus Voyager", minLevel: 4, color: "#fca982" },
  { name: "Mars Explorer", minLevel: 8, color: "#f94d56" },
  { name: "Jupiter Captain", minLevel: 16, color: "#29b4dd" },
  { name: "Saturn Navigator", minLevel: 25, color: "#b18dbe" },
  { name: "Neptune Commander", minLevel: 40, color: "#8eacf3" },
  { name: "Galactic Legend", minLevel: 60, color: "#6ff2f0" }
];

// Load initial content
function loadTheme(themeKey) {
  paragraph = THEMES[themeKey][Math.floor(Math.random() * THEMES[themeKey].length)];
  textToTypeElement.textContent = paragraph;
  themeImage.innerHTML = `<img src="${THEME_BACKGROUNDS[themeKey]}" alt="${themeKey}" />`;
  backgroundOverlay.style.backgroundImage = `url(${THEME_BACKGROUNDS[themeKey]})`;
  input.value = "";
  input.disabled = false;
  input.focus();
  startTime = null;
  totalErrors = 0;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100";
  progressBar.value = 0;
  nextBtn.style.display = "none";
  levelInfo.textContent = `Level ${currentLevel}`;
}

// Calculate stats
function calculateStats() {
  if (!startTime) return { wpm: 0, accuracy: 100 };
  const now = new Date();
  const timeInMinutes = (now - startTime) / 1000 / 60;
  const chars = input.value.length;
  const words = chars / 5;
  const wpm = Math.round(words / (timeInMinutes || 1e-3));
  const accuracy = chars ? Math.max(0, Math.round(((chars - totalErrors) / chars) * 100)) : 100;
  return { wpm, accuracy };
}

function updateDisplayStats() {
  const { wpm, accuracy } = calculateStats();
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
}

function updateTier() {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (currentLevel >= tiers[i].minLevel) {
      tier = tiers[i];
      tierBadge.textContent = tier.name;
      tierBadge.style.color = tier.color;
      break;
    }
  }
}

function checkTyping() {
  const typed = input.value;
  if (!startTime && typed.length) {
    startTime = new Date();
    startCountdown();
  }
  totalErrors = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== paragraph[i]) totalErrors++;
  }

  updateDisplayStats();
  progressBar.value = (typed.length / paragraph.length) * 100;

  if (typed === paragraph) {
    finishChallenge();
  }
}

function finishChallenge() {
  clearInterval(timer);
  input.disabled = true;
  nextBtn.style.display = "block";

  const { wpm, accuracy } = calculateStats();
  stats.completed++;
  stats.totalWPM += wpm;
  stats.totalAccuracy += accuracy;
  stats.bestWPM = Math.max(stats.bestWPM, wpm);
  stats.bestAccuracy = Math.max(stats.bestAccuracy, accuracy);

  completedDisplay.textContent = stats.completed;
  bestWPMDisplay.textContent = stats.bestWPM;
  avgWPMDisplay.textContent = Math.round(stats.totalWPM / stats.completed);
  bestAccuracyDisplay.textContent = stats.bestAccuracy;

  popupStats.innerHTML = `
    <p><strong>WPM:</strong> ${wpm}</p>
    <p><strong>Accuracy:</strong> ${accuracy}%</p>
    <p><strong>Level:</strong> ${currentLevel}</p>
    <p><strong>Tier:</strong> ${tier.name}</p>
  `;
  popupContainer.classList.remove("popup-hide");

  if (THEME_SOUNDS[currentTheme]) {
    const audio = new Audio(THEME_SOUNDS[currentTheme]);
    audio.play();
  }
}

function hidePopup() {
  popupContainer.classList.add("popup-hide");
  currentLevel++;
  updateTier();
  loadTheme(currentTheme);
}

function startCountdown() {
  const mins = parseInt(timeSelect.value);
  if (!mins) return;
  timeLeft = mins * 60;
  timer = setInterval(() => {
    timeLeft--;
    levelInfo.textContent = `Level ${currentLevel} - Time Left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      input.disabled = true;
      popupStats.innerHTML = `<p>⏰ Time's up!</p>`;
      popupContainer.classList.remove("popup-hide");
    }
  }, 1000);
}

input.addEventListener("input", checkTyping);
nextBtn.addEventListener("click", () => {
  currentLevel++;
  updateTier();
  loadTheme(currentTheme);
});
closePopupBtn.addEventListener("click", hidePopup);

// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTheme = btn.dataset.theme;
    loadTheme(currentTheme);
  });
});

// Dark mode toggle
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Init
updateTier();
loadTheme(currentTheme);
