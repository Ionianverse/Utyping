=const themeButtons = document.querySelectorAll(".tab-btn");
const challengeText = document.getElementById("challenge-text");
const input = document.getElementById("typing-input");
const nextBtn = document.getElementById("next-btn");
const wpmStat = document.getElementById("wpm");
const accuracyStat = document.getElementById("accuracy");
const timerSelect = document.getElementById("practice-time-select");
const popup = document.getElementById("popup-container");
const popupContent = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");
const tierBadge = document.getElementById("tier-badge");
const progressBar = document.getElementById("progress-bar");

const THEMES = {
  space: { display: "Universe/Space", file: "space.txt" },
  general: { display: "General", file: "general.txt" },
  science: { display: "Science", file: "science.txt" },
  biology: { display: "Biology", file: "biology.txt" },
  engineering: { display: "Engineering", file: "engineering.txt" },
  ai: { display: "AI & Technology", file: "ai.txt" },
};

let currentTheme = "space";
let allItems = [];
let currentText = "";
let typedText = "";
let startTime, interval;
let totalTyped = 0;
let correctTyped = 0;

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    themeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTheme = btn.dataset.theme;
    loadThemeItems(currentTheme);
  });
});

function loadThemeItems(themeKey) {
  const theme = THEMES[themeKey];
  fetch(theme.file + "?v=" + Date.now())
    .then(res => res.text())
    .then(data => {
      allItems = data.split(/\r?\n/).map(line => line.trim()).filter(line => line);
      startNewChallenge();
    })
    .catch(() => {
      allItems = ["Failed to load content."];
      startNewChallenge();
    });
}

function startNewChallenge() {
  if (!allItems.length) {
    challengeText.textContent = "No text found.";
    return;
  }
  const item = allItems[Math.floor(Math.random() * allItems.length)];
  currentText = item;
  challengeText.textContent = item;
  input.value = "";
  input.disabled = false;
  input.focus();
  nextBtn.style.display = "none";
  startTime = new Date();
  totalTyped = 0;
  correctTyped = 0;

  let time = parseInt(timerSelect.value);
  if (time > 0) {
    clearInterval(interval);
    let seconds = time * 60;
    interval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(interval);
        showPopup();
        input.disabled = true;
      }
    }, 1000);
  }
}

function showPopup() {
  let wpm = calculateWPM();
  let acc = calculateAccuracy();
  popup.querySelector("h3").textContent = "Session Complete!";
  popup.querySelector("p").textContent = `WPM: ${wpm}, Accuracy: ${acc}%`;
  popup.classList.remove("popup-hide");
}

function calculateWPM() {
  let elapsedMin = (new Date() - startTime) / 60000;
  return Math.round(totalTyped / 5 / elapsedMin);
}

function calculateAccuracy() {
  if (totalTyped === 0) return 100;
  return Math.round((correctTyped / totalTyped) * 100);
}

input.addEventListener("input", () => {
  typedText = input.value;
  totalTyped++;
  correctTyped = [...typedText].filter((char, i) => char === currentText[i]).length;

  if (typedText === currentText) {
    input.disabled = true;
    nextBtn.style.display = "block";
    clearInterval(interval);
    showPopup();
  }
});

nextBtn.addEventListener("click", startNewChallenge);
closePopup.addEventListener("click", () => popup.classList.add("popup-hide"));

window.addEventListener("DOMContentLoaded", () => {
  loadThemeItems(currentTheme);
});
