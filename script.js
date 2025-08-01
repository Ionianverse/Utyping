// Query elements
const themeButtons = document.querySelectorAll(".tab-btn");
const challengeText = document.getElementById("challenge-text");
const input = document.getElementById("typing-input");
const nextBtn = document.getElementById("next-btn");
const wpmStat = document.getElementById("wpm");
const accuracyStat = document.getElementById("accuracy");
const timerSelect = document.getElementById("practice-time-select");
const popupContainer = document.getElementById("popup-container");
const popupStats = document.getElementById("popup-stats");
const closePopup = document.getElementById("close-popup");
const tierBadge = document.getElementById("tier-badge");
const progressBar = document.getElementById("progress-bar");
const timerLine = document.getElementById("timer-line");
const toggleDarkBtn = document.getElementById("toggle-dark");
const toggleSoundBtn = document.getElementById("toggle-sound");
const downloadCsvBtn = document.getElementById("download-csv");

const THEMES = {
  space: { display: "Universe/Space", file: "space.txt", bg: 'url("https://media.giphy.com/media/QU7DRFzMtbZTU/giphy.gif")' },
  general: { display: "General", file: "general.txt", bg: 'url("https://media.giphy.com/media/5xtDarDFwPbgd2cI5g4/giphy.gif")' },
  science: { display: "Science", file: "science.txt", bg: 'url("https://media.giphy.com/media/l0MYu5TvlTZkVFM8k/giphy.gif")' },
  biology: { display: "Biology", file: "biology.txt", bg: 'url("https://media.giphy.com/media/3o6ZtbIPLwtXmGREXO/giphy.gif")' },
  engineering: { display: "Engineering", file: "engineering.txt", bg: 'url("https://media.giphy.com/media/BqUfuAz4WtpJK/giphy.gif")' },
  ai: { display: "AI & Technology", file: "ai.txt", bg: 'url("https://media.giphy.com/media/3o7btTRcUZPryvn2Te/giphy.gif")' },
};

let currentTheme = "space";
let allItems = [];
let currentText = "";
let typedText = "";
let startTime = null;
let intervalId = null;
let timerLineIntervalId = null;
let totalTyped = 0;
let correctTyped = 0;
let completedChallenges = 0;

let statsHistory = [];

let soundEnabled = true;

// Helper: Load text file with fallback if needed
function loadThemeItems(themeKey) {
  const theme = THEMES[themeKey];
  document.getElementById("background-overlay").style.backgroundImage = theme.bg || "";
  tierBadge.textContent = theme.display + " Tier";

  fetch(theme.file + "?v=" + Date.now())
    .then(res => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.text();
    })
    .then(data => {
      allItems = data.split(/\r?\n/).map(line => line.trim()).filter(line => line);
      startNewChallenge();
    })
    .catch(() => {
      allItems = ["Failed to load content. Please try again later."];
      startNewChallenge();
    });
}

// Start one typing challenge
function startNewChallenge() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timerLineIntervalId) {
    clearInterval(timerLineIntervalId);
    timerLineIntervalId = null;
  }

  if (!allItems.length) {
    challengeText.textContent = "No text found.";
    input.disabled = true;
    nextBtn.style.display = "none";
    return;
  }

  // Pick a random text item
  currentText = allItems[Math.floor(Math.random() * allItems.length)];
  challengeText.textContent = currentText;
  input.value = "";
  input.disabled = false;
  input.focus();

  // Reset stats
  startTime = new Date();
  totalTyped = 0;
  correctTyped = 0;
  typedText = "";
  wpmStat.textContent = 0;
  accuracyStat.textContent = 100;
  nextBtn.style.display = "none";
  progressBar.value = 0;
  timerLine.style.width = "100%";

  let practiceTime = parseInt(timerSelect.value);
  if (practiceTime > 0) {
    let secondsRemaining = practiceTime * 60;
    // Timer countdown
    intervalId = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        input.disabled = true;
        showPopup();
        nextBtn.style.display = "block";
        timerLine.style.width = "0%";
      }
    }, 1000);
    startTimerLine(practiceTime * 60);
  } else {
    timerLine.style.width = "0%";
  }
}

// Animate timer line shrinking over time
function startTimerLine(totalSeconds) {
  if (timerLineIntervalId) clearInterval(timerLineIntervalId);
  let timePassed = 0;
  timerLine.style.width = "100%";

  timerLineIntervalId = setInterval(() => {
    timePassed++;
    let widthPercent = ((totalSeconds - timePassed) / totalSeconds) * 100;
    if (widthPercent <= 0) {
      timerLine.style.width = "0%";
      clearInterval(timerLineIntervalId);
      timerLineIntervalId = null;
    } else {
      timerLine.style.width = widthPercent + "%";
    }
  }, 1000);
}

// Calculates Words Per Minute
function calculateWPM() {
  const elapsedTime = (new Date() - startTime) / 60000; // minutes
  if (elapsedTime <= 0) return 0;
  return Math.round(totalTyped / 5 / elapsedTime);
}

// Calculate Accuracy %
function calculateAccuracy() {
  if (totalTyped === 0) return 100;
  return Math.round((correctTyped / totalTyped) * 100);
}

// Show popup with detailed stats
function showPopup() {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  const timeSpentSeconds = Math.round((new Date() - startTime) / 1000);

  popupStats.innerHTML = `
    <p><strong>WPM:</strong> ${wpm}</p>
    <p><strong>Accuracy:</strong> ${accuracy}%</p>
    <p><strong>Time spent:</strong> ${timeSpentSeconds} seconds</p>
    <p><strong>Typed Characters:</strong> ${totalTyped}</p>
  `;

  // Update user stats history
  completedChallenges++;
  statsHistory.push({ wpm, accuracy });

  updateUserStats();

  popupContainer.classList.remove("popup-hide");
}

// Update user stats below typing game
function updateUserStats() {
  const bestWPM = Math.max(...statsHistory.map(s => s.wpm), 0);
  const avgWPM = statsHistory.length ? Math.round(statsHistory.reduce((sum, s) => sum + s.wpm, 0) / statsHistory.length) : 0;
  const bestAccuracy = Math.max(...statsHistory.map(s => s.accuracy), 0);

  document.getElementById("completed").textContent = completedChallenges;
  document.getElementById("best-wpm").textContent = bestWPM;
  document.getElementById("avg-wpm").textContent = avgWPM;
  document.getElementById("best-accuracy").textContent = bestAccuracy;
}

// Updates live WPM and accuracy during typing
function updateLiveStats() {
  wpmStat.textContent = calculateWPM();
  accuracyStat.textContent = calculateAccuracy();
  // Update progress bar
  let progressPercent = (typedText.length / currentText.length) * 100;
  progressBar.value = progressPercent > 100 ? 100 : progressPercent;
}

// Sound play (simple beep on keypress)
function playKeySound() {
  if (!soundEnabled) return;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05); // 50ms beep
}

// Event Handling

// Theme tab clicks
themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    themeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTheme = btn.dataset.theme;
    loadThemeItems(currentTheme);
  });
});

// Typing input event
input.addEventListener("input", () => {
  typedText = input.value;
  totalTyped++;

  // Calculate correct typed chars
  correctTyped = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === currentText[i]) correctTyped++;
  }

  updateLiveStats();

  // Check if finished typing challenge
  if (typedText === currentText) {
    input.disabled = true;
    nextBtn.style.display = "block";

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timerLineIntervalId) {
      clearInterval(timerLineIntervalId);
      timerLineIntervalId = null;
    }
    timerLine.style.width = "0%";

    showPopup();
  }
});

// Enable finishing challenge early by Enter key
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    input.disabled = true;
    nextBtn.style.display = "block";

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timerLineIntervalId) {
      clearInterval(timerLineIntervalId);
      timerLineIntervalId = null;
    }
    timerLine.style.width = "0%";

    showPopup();
  }
});

// Next button loads new challenge
nextBtn.addEventListener("click", () => {
  popupContainer.classList.add("popup-hide");
  startNewChallenge();
});

// Close popup button
closePopup.addEventListener("click", () => {
  popupContainer.classList.add("popup-hide");
  input.disabled = false;
  input.focus();
});

// Dark mode toggle functionality
toggleDarkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  let darkModeOn = document.body.classList.contains("dark-mode");
  toggleDarkBtn.textContent = darkModeOn ? "☀️" : "🌙";
});

// Sound toggle functionality
toggleSoundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  toggleSoundBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

// Play typing sound on keydown if enabled
input.addEventListener("keydown", () => {
  playKeySound();
});

// CSV download of stats functionality
downloadCsvBtn.addEventListener("click", () => {
  if (statsHistory.length === 0) {
    alert("No stats available to download yet!");
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Session,WPM,Accuracy\n";
  statsHistory.forEach((s, idx) => {
    csvContent += `${idx + 1},${s.wpm},${s.accuracy}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "utyping_stats.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
});

// On page ready, load initial theme
window.addEventListener("DOMContentLoaded", () => {
  loadThemeItems(currentTheme);
});
