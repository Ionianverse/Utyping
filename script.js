const levels = [
  "Practice makes a man perfect.",
  "The quick brown fox jumps over the lazy dog.",
  "Typing speed improves with daily exercises.",
  "Focus on accuracy before speeding up.",
  "Keyboard shortcuts save a lot of time.",
  "Persistence is the key to mastery.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Debugging is like being the detective in a crime movie.",
  "Stay positive, work hard, make it happen.",
  "Believe in yourself and all that you are."
];

let currentLevel = 1;
let maxLevel = levels.length;
let currentText = "";
let currentCharIndex = 0;
let typed = "";
let correct = 0;
let incorrect = 0;
let total = 0;
let startTime = null;
let timer = null;

function get(id) {
  return document.getElementById(id);
}

const input = get("typing-input");
const referenceText = get("text-to-type");
const levelInfo = get("level-info");
const accuracyDisplay = get("accuracy");
const wpmDisplay = get("wpm");
const timeSelect = get("practice-time-select");

function setLevel(level) {
  currentText = levels[level - 1];
  referenceText.innerHTML = "";
  for (let char of currentText) {
    const span = document.createElement("span");
    span.innerText = char;
    referenceText.appendChild(span);
  }
  input.value = "";
  typed = "";
  currentCharIndex = 0;
  correct = 0;
  incorrect = 0;
  total = 0;
  startTime = null;
  input.disabled = false;
  clearInterval(timer);
  timer = null;
  updateTimerDisplay();
  updateStats();
}

function updateStats() {
  accuracyDisplay.innerText = total ? ((correct / total) * 100).toFixed(1) : "100";
  const elapsedTime = startTime ? (new Date() - startTime) / 1000 / 60 : 0;
  wpmDisplay.innerText = elapsedTime ? Math.round((correct / 5) / elapsedTime) : "0";
}

function updateTimerDisplay() {
  const selectedMinutes = parseInt(timeSelect.value || "0", 10);
  if (selectedMinutes > 0) {
    levelInfo.textContent = `Level ${currentLevel} - Time Left: ${formatTime(selectedMinutes * 60)}`;
  } else {
    levelInfo.textContent = `Level ${currentLevel}`;
  }
}

function startTimer() {
  const duration = parseInt(timeSelect.value || "0", 10) * 60;
  if (duration <= 0) return;

  let remaining = duration;
  levelInfo.textContent = `Level ${currentLevel} - Time Left: ${formatTime(remaining)}`;

  timer = setInterval(() => {
    remaining--;
    levelInfo.textContent = `Level ${currentLevel} - Time Left: ${formatTime(remaining)}`;
    if (remaining <= 0) {
      clearInterval(timer);
      input.disabled = true;
      levelInfo.textContent = `⏰ Time's up! Practice complete.`;
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(timer);
  timer = null;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

input.addEventListener("input", () => {
  if (!startTime && typed.length === 0) {
    startTime = new Date();
    startTimer();
  }

  const value = input.value;
  if (value.length < typed.length) {
    currentCharIndex--;
    typed = typed.slice(0, -1);
  } else {
    const char = value[value.length - 1];
    typed += char;
    const expectedChar = currentText[currentCharIndex];
    const spans = referenceText.querySelectorAll("span");

    if (char === expectedChar) {
      spans[currentCharIndex].style.color = "limegreen";
      correct++;
    } else {
      spans[currentCharIndex].style.color = "crimson";
      incorrect++;
    }
    total++;
    currentCharIndex++;
  }

  updateStats();

  if (typed === currentText) {
    clearInterval(timer);
    if (currentLevel < maxLevel) {
      currentLevel++;
      setTimeout(() => {
        setLevel(currentLevel);
        input.focus();
      }, 1000);
    } else {
      levelInfo.textContent = `🎉 All levels completed!`;
      input.disabled = true;
    }
  }
});

timeSelect.addEventListener("change", () => {
  if (!startTime) {
    clearTimer();
    updateTimerDisplay();
    input.disabled = false;
  }
});

// Init game
setLevel(currentLevel);
