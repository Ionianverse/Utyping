// Sentences pool (can add more)
const sentences = [
  "Explore the Mercury base with blazing speed.",
  "Mars is the red planet full of secrets.",
  "Venus shines bright like a morning star.",
  "Jupiter's storms rage across the giant planet.",
  "Saturn's rings are made of ice and rock.",
  "Neptune is a cold and windy blue world.",
  "The Milky Way galaxy holds billions of stars.",
  "Astronauts train hard for space exploration.",
  "Black holes warp space and time around them.",
  "Galaxies collide in a celestial dance."
];

// Space-themed tiers
const tiers = [
  {name: "Mercury Novice", minLevel: 1},
  {name: "Venus Voyager", minLevel: 3},
  {name: "Mars Explorer", minLevel: 5},
  {name: "Jupiter Captain", minLevel: 7},
  {name: "Saturn Navigator", minLevel: 9},
  {name: "Neptune Commander", minLevel: 11},
  {name: "Galactic Legend", minLevel: 15}
];

let currentSentence = "";
let currentLevel = 1;
let tier = tiers[0];
let startTime = null;
let totalTyped = 0;
let totalErrors = 0;

const textToTypeElement = document.getElementById("text-to-type");
const input = document.getElementById("typing-input");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const tierBadge = document.getElementById("tier");
const progressBar = document.getElementById("progress-bar");
const levelInfo = document.getElementById("level-info");
const nextBtn = document.getElementById("next-btn");

function pickSentence() {
  // Simple random pick from sentences
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function updateTier() {
  // Determine tier based on currentLevel
  for(let i = tiers.length - 1; i >= 0; i--) {
    if(currentLevel >= tiers[i].minLevel) {
      tier = tiers[i];
      break;
    }
  }
  tierBadge.textContent = tier.name;
}

function startNewChallenge() {
  currentSentence = pickSentence();
  textToTypeElement.textContent = currentSentence;
  input.value = "";
  input.disabled = false;
  input.focus();
  startTime = new Date();
  totalTyped = 0;
  totalErrors = 0;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100";
  progressBar.value = 0;
  levelInfo.textContent = `Level ${currentLevel}`;
  nextBtn.style.display = "none";
}

function calculateStats() {
  let now = new Date();
  let timeInMinutes = (now - startTime) / 1000 / 60;

  // Words typed = total chars / 5 approx
  let wordsTyped = totalTyped / 5;
  let wpm = Math.round(wordsTyped / timeInMinutes);

  // Accuracy percentage
  let accuracy = totalTyped === 0 ? 100 : Math.max(0, Math.round(((totalTyped - totalErrors) / totalTyped) * 100));

  wpmDisplay.textContent = isFinite(wpm) && wpm > 0 ? wpm : 0;
  accuracyDisplay.textContent = accuracy;
}

function checkInput() {
  let typed = input.value;
  totalTyped = typed.length;

  // Count errors by comparing with sentence start
  let errors = 0;
  for(let i=0; i<typed.length; i++) {
    if(typed[i] !== currentSentence[i]) errors++;
  }
  totalErrors = errors;

  calculateStats();
  progressBar.value = Math.min((typed.length / currentSentence.length) * 100, 100);

  // If finished correctly, show next btn and disable input
  if(typed === currentSentence) {
    input.disabled = true;
    nextBtn.style.display = "block";
  }
}

// Increase level and start new challenge on next button click
nextBtn.addEventListener("click", () => {
  currentLevel++;
  updateTier();
  startNewChallenge();
});

input.addEventListener("input", checkInput);

// Initialize
updateTier();
startNewChallenge();

