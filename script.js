const THEME_SOUNDS = {
  space: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12c82c6b54.mp3',         // Spacey ambient
  general: 'https://cdn.pixabay.com/audio/2022/12/19/audio_12c28e7ff4.mp3',      // Soft click
  science: 'https://cdn.pixabay.com/audio/2022/06/12/audio_12c1d8317c.mp3',      // Digital confirm
  biology: 'https://cdn.pixabay.com/audio/2022/11/16/audio_12e6e3387d.mp3',      // Nature spark
  engineering: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12c83f28e1.mp3',  // Mechanical
  ai: 'https://cdn.pixabay.com/audio/2022/11/16/audio_12e6e338f6.mp3'            // Futuristic
};


// Themes metadata with linked text files and images
const THEMES = {
  space: {
    display: "Universe/Space",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    file: "space.txt"
  },
  general: {
    display: "General",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    file: "general.txt"
  },
  science: {
    display: "Science",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    file: "science.txt"
  },
  biology: {
    display: "Biology",
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
    file: "biology.txt"
  },
  engineering: {
    display: "Engineering",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    file: "engineering.txt"
  },
  ai: {
    display: "AI & Technology",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    file: "ai.txt"
  }
};

// DOM Elements helper
const get = id => document.getElementById(id);
const textToTypeElement = get("text-to-type");
const input = get("typing-input");
const wpmDisplay = get("wpm");
const accuracyDisplay = get("accuracy");
const tierBadge = get("tier");
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

let allItems = []; // Loaded paragraphs from current theme file
let currentTheme = "space";

let currentLevel = 1;
let tier = null;
let currentParagraph = "";
let startTime = null;
let totalTyped = 0;
let totalErrors = 0;
let showFeedback = false;

let stats = {
  completed: 0,
  totalWPM: 0,
  totalAccuracy: 0,
  bestWPM: 0,
  bestAccuracy: 0
};


const tiers = [
  {name: "Mercury Novice", minLevel: 1, color: "#ffcc32"},
  {name: "Venus Voyager", minLevel: 4, color: "#fca982"},
  {name: "Mars Explorer", minLevel: 8, color: "#f94d56"},
  {name: "Jupiter Captain", minLevel: 16, color: "#29b4dd"},
  {name: "Saturn Navigator", minLevel: 25, color: "#b18dbe"},
  {name: "Neptune Commander", minLevel: 40, color: "#8eacf3"},
  {name: "Galactic Legend", minLevel: 60, color: "#6ff2f0"}
];

// --- Load theme paragraphs from the external file asynchronously ---
async function loadThemeItems(themeKey) {
  const theme = THEMES[themeKey];
  
  // Show theme image
  themeImage.innerHTML = theme.image ? `<img src="${theme.image}" alt="${theme.display}">` : "";

  try {
    // Fetch the content with a cache buster to avoid stale cache
    const response = await fetch(theme.file + "?v=" + Date.now());
    if (!response.ok) throw new Error(`Failed to load ${theme.file}`);
    const text = await response.text();
    // Split by lines, trim and filter empty lines
    allItems = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (allItems.length === 0) allItems = ["No content found! Please add paragraphs to the file."];
  } catch (error) {
    allItems = ["Error loading paragraphs. Please check the content files."];
    console.error(error);
  }

  startNewChallenge();
}

// --- Select a random paragraph from loaded items ---
function pickParagraph() {
  return allItems[Math.floor(Math.random() * allItems.length)];
}

// --- Tier update logic ---
function updateTier() {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (currentLevel >= tiers[i].minLevel) {
      if (!tier || tier.name !== tiers[i].name) {
        showTierMessage(tiers[i].name, tiers[i].color);
      }
      tier = tiers[i];
      break;
    }
  }
  tierBadge.textContent = tier.name;
  tierBadge.style.color = tier.color;
}

function showTierMessage(name, color) {
  const msg = document.createElement('div');
  msg.textContent = `🚀 Tier Up! Welcome to: ${name}`;
  msg.style.background = color;
  msg.style.color = "#fff";
  msg.style.position = "fixed";
  msg.style.top = "18%";
  msg.style.left = "50%";
  msg.style.padding = "1.3rem 2rem";
  msg.style.borderRadius = "2rem";
  msg.style.fontSize = "1.13rem";
  msg.style.fontWeight = "bold";
  msg.style.boxShadow = "0 0 44px #a3d3fa";
  msg.style.transform = "translate(-50%, -50%) scale(1.1)";
  msg.style.zIndex = "1001";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1800);
}

// --- Start a new typing challenge ---
function startNewChallenge() {
  currentParagraph = pickParagraph();
  textToTypeElement.textContent = currentParagraph;
  input.value = "";
  input.disabled = false;
  input.focus();
  startTime = null;
  totalTyped = 0;
  totalErrors = 0;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100";
  progressBar.value = 0;
  levelInfo.textContent = `Level ${currentLevel}`;
  nextBtn.style.display = "none";
  showFeedback = false;
}

// --- Update stats displayed in the dashboard ---
function updateStatsDisplay() {
  completedDisplay.textContent = stats.completed;
  bestWPMDisplay.textContent = stats.bestWPM;
  avgWPMDisplay.textContent = stats.completed === 0 ? 0 : Math.round(stats.totalWPM / stats.completed);
  bestAccuracyDisplay.textContent = stats.bestAccuracy + "%";
}

// --- Calculate current WPM and accuracy ---
function calculateStats() {
  if (!startTime) return {wpm: 0, accuracy: 100};
  const now = new Date();
  const timeInMinutes = (now - startTime) / 1000 / 60;
  const chars = input.value.length;
  const wordsTyped = chars / 5;
  const wpm = Math.round(wordsTyped / (timeInMinutes || 1e-3));
  const accuracy = chars === 0 ? 100 : Math.max(0, Math.round(((chars - totalErrors) / chars) * 100));
  wpmDisplay.textContent = isFinite(wpm) && wpm > 0 ? wpm : 0;
  accuracyDisplay.textContent = accuracy;
  return {wpm, accuracy};
}

// --- Check user input on typing ---
function checkInput(evt) {
  const typed = input.value;
  if (!startTime && typed.length) startTime = new Date();

  totalTyped = typed.length;
  totalErrors = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== currentParagraph[i]) totalErrors++;
  }

  calculateStats();

  progressBar.value = Math.min((typed.length / currentParagraph.length) * 100, 100);

  // When paragraph typed perfectly, show popup once
  if (typed === currentParagraph && !showFeedback) {
    input.disabled = true;
    showFeedback = true;
    setTimeout(() => showPopup(), 180);
  }
}

// --- Show statistics feedback popup ---
function showPopup() {
  if (THEME_SOUNDS[currentTheme]) {
    const audio = new Audio(THEME_SOUNDS[currentTheme]);
    audio.play();
  }

  const {wpm, accuracy} = calculateStats();

  // Update & save stats
  stats.completed += 1;
  stats.totalWPM += wpm;
  stats.totalAccuracy += accuracy;
  if (wpm > stats.bestWPM) stats.bestWPM = wpm;
  if (accuracy > stats.bestAccuracy) stats.bestAccuracy = accuracy;
  updateStatsDisplay();

  // Personalized feedback example (you can customize further)
  let feedbackText = "";
  if (wpm > 80 && accuracy >= 98) feedbackText = "Blazing fast and super accurate! 🚀";
  else if (wpm > 60 && accuracy >= 95) feedbackText = "Fast fingers and sharp focus! 💡";
  else if (wpm > 40) feedbackText = "Great speed—keep pushing for more! 🔥";
  else if (accuracy < 85) feedbackText = "Try to slow down and focus on accuracy! 🎯";
  else feedbackText = "Solid! Practice daily for mastery. 🌱";

  popupStats.innerHTML = `
    <ul style="text-align:left; line-height:1.7; margin-bottom:0.9rem;">
      <li><strong>WPM:</strong> ${wpm}</li>
      <li><strong>Accuracy:</strong> ${accuracy}%</li>
      <li><strong>Paragraph Completed:</strong> ${stats.completed}</li>
      <li><strong>Tier:</strong> ${tier.name}</li>
      <li><strong>Level:</strong> ${currentLevel}</li>
    </ul>
    <span style="font-size:1.01rem; color:#5692e8; font-weight:600;">${feedbackText}</span>
  `;

  popupContainer.classList.remove('popup-hide');

  // Close popup on Enter key
  document.onkeydown = function(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      closePopupBtn.click();
    }
  }
}

// --- Hide popup and start next challenge ---
function hidePopup() {
  popupContainer.classList.add('popup-hide');
  document.onkeydown = null;
  // Increment level and update tier when popup closes
  currentLevel++;
  updateTier();
  startNewChallenge();
}

// --- Event listeners ---
input.addEventListener("input", checkInput);

// Prevent Enter key submitting or adding new lines; confirmed paragraph shows popup
input.addEventListener("keydown", function(evt){
  if (evt.key === "Enter") {
    evt.preventDefault();
    if (input.value === currentParagraph && !showFeedback) {
      showPopup();
    }
  }
});

nextBtn.addEventListener("click", () => {
  currentLevel++;  // Caution: This also increments level, so be sure this button is used carefully.
  updateTier();
  startNewChallenge();
});
closePopupBtn.addEventListener("click", hidePopup);

// Tabs buttons behavior with accessible active state update
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedTheme = btn.getAttribute('data-theme');
    if (selectedTheme === currentTheme) return; // no change

    // Update active tab button classes & aria-selected
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      b.tabIndex = b === btn ? 0 : -1;
    });

    // Update current theme and load content
    currentTheme = selectedTheme;
    switchTheme(currentTheme);
    loadThemeItems(currentTheme);
  });
});

// --- Switch theme, load contents, update UI ---
function switchTheme(newTheme) {
  // Corrected background images to match THEMES images more logically
  const themeBackgrounds = {
    space: "linear-gradient(135deg, #000b21 0%, #101532 100%), url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=80') center/cover fixed",
    general: "linear-gradient(135deg, #fff9f1 0%, #e8e0ca 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80') center/cover fixed",
    science: "linear-gradient(135deg, #1f2f45 0%, #3a3a68 100%), url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1400&q=80') center/cover fixed",
    biology: "linear-gradient(135deg, #234c3c 0%, #a1eac9 100%), url('https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=1400&q=80') center/cover fixed",
    engineering: "linear-gradient(135deg, #181b2d 0%, #3f4277 100%), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80') center/cover fixed",
    ai: "linear-gradient(135deg, #00061a 0%, #abb3ce 100%), url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80') center/cover fixed"
  };
  document.body.style.background = themeBackgrounds[newTheme] || "";
}

// --- Reset stats for demo: Ctrl+Shift+R ---
window.addEventListener("keydown", evt => {
  if (evt.ctrlKey && evt.shiftKey && evt.key.toLowerCase() === "r") {
    localStorage.removeItem('stats_v2');
    stats = {completed: 0, totalWPM: 0, totalAccuracy: 0, bestWPM: 0, bestAccuracy: 0};
    updateStatsDisplay();
    currentLevel = 1;
    updateTier();
    startNewChallenge();
    alert("Stats and progress reset!");
  }
});

// --- Initialization ---
switchTheme(currentTheme);
updateTier();
updateStatsDisplay();
loadThemeItems(currentTheme);


/* Recommended CSS for visually-hidden label (if you add a label for the textarea):

.visually-hidden {
  position: absolute;
  width: 1px; 
  height: 1px; 
  padding: 0; 
  margin: -1px; 
  overflow: hidden; 
  clip: rect(0,0,0,0); 
  border: 0;
}
*/

/* Also confirm your CSS for .tab-btn.active styles to visually highlight active theme button */
