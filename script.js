const themeButtons = document.querySelectorAll(".tab-btn");
const challengeText = document.getElementById("challenge-text");
const input = document.getElementById("typing-input");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const nextBtn = document.getElementById("next-btn");
const tierBadge = document.getElementById("tier-badge");
const levelInfo = document.getElementById("level-info");
const progressBar = document.getElementById("progress-bar");
const popupContainer = document.getElementById("popup-container");
const popupStats = document.getElementById("popup-stats");
const closePopup = document.getElementById("close-popup");
const themeImage = document.getElementById("theme-image");
const timeSelect = document.getElementById("practice-time-select");

const completedDisplay = document.getElementById("completed");
const bestWPMDisplay = document.getElementById("best-wpm");
const avgWPMDisplay = document.getElementById("avg-wpm");
const bestAccuracyDisplay = document.getElementById("best-accuracy");

const THEMES = {
  space: { display: "Universe/Space", file: "space.txt", image: "" },
  general: { display: "General", file: "general.txt", image: "" },
  science: { display: "Science", file: "science.txt", image: "" },
  biology: { display: "Biology", file: "biology.txt", image: "" },
  engineering: { display: "Engineering", file: "engineering.txt", image: "" },
  ai: { display: "AI & Technology", file: "ai.txt", image: "" },
};

let currentTheme = "space";
let currentText = "";
let timer = null;
let timeLeft = 0;
let currentLevel = 1;
let stats = {
  completed: 0,
  bestWPM: 0,
  bestAccuracy: 0,
  totalWPM: 0,
  totalAccuracy: 0,
};

let allItems = [];

function loadThemeItems(themeKey) {
  const theme = THEMES[themeKey];
  themeImage.innerHTML = theme.image ? `<img src="${theme.image}" alt="${theme.display}">` : "";
  fetch(theme.file + "?v=" + Date.now())
    .then((res) => res.text())
    .then((data) => {
      allItems = data
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      startNewChallenge();
    });
}

function startNewChallenge() {
  const item = allItems[Math.floor(Math.random() * allItems.length)];
  currentText = item;
  challengeText.textContent = item;
  input.value = "";
  input.disabled = false;
  input.focus();
  nextBtn.style.display = "none";
  progressBar.value = 0;
  tierBadge.textContent = "Tier";
  startCountdown();
}

function startCountdown() {
  const mins = parseInt(timeSelect.value);
  if (!mins || isNaN(mins)) return;

  timeLeft = mins * 60;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    levelInfo.textContent = `Level ${currentLevel} - Time Left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      finishChallenge(true);
    }
  }, 1000);
}

function calculateStats() {
  const typed = input.value.trim();
  const expected = currentText.trim();
  const correctChars = [...typed].filter((c, i) => c === expected[i]).length;
  const accuracy = Math.round((correctChars / expected.length) * 100);
  const wpm = Math.round((typed.length / 5) / (1 / 60));
  return { wpm, accuracy };
}

function finishChallenge(timeout = false) {
  clearInterval(timer);
  input.disabled = true;
  nextBtn.style.display = timeout ? "none" : "block";

  const { wpm, accuracy } = calculateStats();
  if (!timeout) {
    stats.completed++;
    stats.totalWPM += wpm;
    stats.totalAccuracy += accuracy;
    stats.bestWPM = Math.max(stats.bestWPM, wpm);
    stats.bestAccuracy = Math.max(stats.bestAccuracy, accuracy);
  }

  completedDisplay.textContent = stats.completed;
  bestWPMDisplay.textContent = stats.bestWPM;
  avgWPMDisplay.textContent = Math.round(stats.totalWPM / stats.completed || 1);
  bestAccuracyDisplay.textContent = stats.bestAccuracy;

  popupStats.innerHTML = timeout
    ? `<p>⏰ Time's up! Good job.</p>`
    : `<p><strong>WPM:</strong> ${wpm}</p>
       <p><strong>Accuracy:</strong> ${accuracy}%</p>
       <p><strong>Level:</strong> ${currentLevel}</p>
       <p><strong>Tier:</strong> ${tierBadge.textContent}</p>`;

  popupContainer.classList.remove("popup-hide");
}

input.addEventListener("input", () => {
  const typed = input.value.trim();
  const expected = currentText.trim();

  const correctChars = [...typed].filter((c, i) => c === expected[i]).length;
  const accuracy = Math.round((correctChars / expected.length) * 100);
  const wpm = Math.round((typed.length / 5) / (1 / 60));

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;

  progressBar.value = Math.min((typed.length / expected.length) * 100, 100);

  if (typed === expected) finishChallenge();
});

nextBtn.addEventListener("click", () => {
  currentLevel++;
  levelInfo.textContent = `Level ${currentLevel}`;
  popupContainer.classList.add("popup-hide");
  startNewChallenge();
});

closePopup.addEventListener("click", () => {
  popupContainer.classList.add("popup-hide");
  if (!input.disabled) return;
  startNewChallenge();
});

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTheme = btn.dataset.theme;
    loadThemeItems(currentTheme);
  });
});

document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

document.getElementById("toggle-sound").addEventListener("click", () => {
  alert("Sound toggle not yet implemented.");
});

document.getElementById("download-csv").addEventListener("click", () => {
  const csv = `Completed,WPM,Accuracy,Best WPM,Best Accuracy\n${stats.completed},${Math.round(stats.totalWPM / stats.completed || 1)},${Math.round(stats.totalAccuracy / stats.completed || 1)},${stats.bestWPM},${stats.bestAccuracy}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "typing_stats.csv";
  a.click();
});

window.addEventListener("load", () => {
  loadThemeItems(currentTheme);
});
