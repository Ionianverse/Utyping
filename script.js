// Grab all needed elements
const typingInput = document.getElementById('typing-input');
const textToTypeElem = document.getElementById('text-to-type');
const wpmElem = document.getElementById('wpm');
const accuracyElem = document.getElementById('accuracy');
const completedElem = document.getElementById('completed');
const bestWpmElem = document.getElementById('best-wpm');
const avgWpmElem = document.getElementById('avg-wpm');
const bestAccuracyElem = document.getElementById('best-accuracy');
const nextBtn = document.getElementById('next-btn');
const popupContainer = document.getElementById('popup-container');
const popupStats = document.getElementById('popup-stats');
const closePopupBtn = document.getElementById('close-popup');
const practiceTimeSelect = document.getElementById('practice-time-select');

let timerId = null;
let timeLeft = 0;
let totalTime = 0;
let startTime = 0;

let currentText = ''; // the current text to type, can be updated dynamically
let completedParagraphs = 0;

let bestWpm = 0;
let totalWpmSum = 0;
let totalTests = 0;
let bestAccuracy = 0;

// Insert or load initial text to type (you should replace this with your real source)
function loadText() {
  // Example static text; replace or improve as needed
  currentText = 'The quick brown fox jumps over the lazy dog.';
  textToTypeElem.textContent = currentText;
}

// Calculate WPM and accuracy based on user input
function calculateResults() {
  const typedText = typingInput.value;
  const typedWords = typedText.trim().split(/\s+/).filter(Boolean);
  const originalWords = currentText.trim().split(/\s+/);

  // Calculate correct words count
  let correctWords = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === originalWords[i]) {
      correctWords++;
    }
  }

  // Calculate accuracy percentage: characters correct / total typed characters
  const totalCharsTyped = typedText.length;
  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === currentText[i]) {
      correctChars++;
    }
  }
  const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;

  // Calculate WPM - words per minute (based on totalTime in minutes)
  const timeSpent = (Date.now() - startTime) / 1000 / 60; // minutes
  const wpm = timeSpent > 0 ? Math.round(correctWords / timeSpent) : 0;

  return { wpm, accuracy };
}

// Update stats display during typing
function updateStats() {
  const { wpm, accuracy } = calculateResults();
  wpmElem.textContent = wpm;
  accuracyElem.textContent = accuracy;
}

// Timer countdown function
function startTimer(duration) {
  if (timerId) clearInterval(timerId);

  timeLeft = duration;
  totalTime = duration;
  startTime = Date.now();

  updateTimerDisplay();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      endTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  // Add or update timer display in your UI
  let timerDisplay = document.getElementById('timer-display');
  if (!timerDisplay) {
    timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.style.fontSize = '20px';
    timerDisplay.style.marginBottom = '1rem';
    timerDisplay.style.textAlign = 'center';
    // Insert timer display on top of typing game
    const mainSection = document.getElementById('typing-game');
    mainSection.insertBefore(timerDisplay, mainSection.firstChild);
  }
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}

function endTest() {
  typingInput.disabled = true;
  nextBtn.style.display = 'inline-block';

  const { wpm, accuracy } = calculateResults();

  // Update best and average stats
  totalTests++;
  totalWpmSum += wpm;
  bestWpm = Math.max(bestWpm, wpm);
  bestAccuracy = Math.max(bestAccuracy, accuracy);

  completedParagraphs++;

  completedElem.textContent = completedParagraphs;
  bestWpmElem.textContent = bestWpm;
  avgWpmElem.textContent = Math.round(totalWpmSum / totalTests);
  bestAccuracyElem.textContent = bestAccuracy + '%';

  // Show popup with results
  popupStats.innerHTML = `
    <p>Your WPM: <strong>${wpm}</strong></p>
    <p>Your Accuracy: <strong>${accuracy}%</strong></p>
  `;
  popupContainer.classList.remove('popup-hide');
  popupContainer.focus();
}

function resetTest() {
  typingInput.disabled = false;
  typingInput.value = '';
  wpmElem.textContent = '0';
  accuracyElem.textContent = '100';
  nextBtn.style.display = 'none';

  loadText();

  // Remove timer display if exists
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.remove();
  }
}

function startTest() {
  resetTest();

  const selectedMinutes = Number(practiceTimeSelect.value);

  if (selectedMinutes > 0) {
    startTimer(selectedMinutes * 60);
  } else {
    // No timer selected, so just enable typing but no countdown
    typingInput.focus();
  }
}

// Event listeners

// When user types, update stats live if timer running or no timer
typingInput.addEventListener('input', () => {
  if (!typingInput.disabled) {
    updateStats();
  }
});

// When practice time selection changes, start or reset test accordingly
practiceTimeSelect.addEventListener('change', () => {
  startTest();
});

// Handle Next Challenge button click - here just restarting the test for now
nextBtn.addEventListener('click', () => {
  startTest();
  popupContainer.classList.add('popup-hide');
});

// Close popup continue button
closePopupBtn.addEventListener('click', () => {
  popupContainer.classList.add('popup-hide');
  typingInput.focus();
});

// Initial load
loadText();
typingInput.disabled = true;  // Disable input on initial load until user selects time

// Optionally, if you want to start immediately without user selection:
// startTest();
