// ------------- Content Bank -------------
const THEMES = {
  space: {
    display: "Universe/Space",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Solar_sys.jpg/320px-Solar_sys.jpg",
    items: [
      "Mercury, closest to the Sun, orbits swiftly and faces dramatic temperature shifts.",
      "Venus's thick clouds reflect sunlight, making it the brightest planet in our night sky.",
      "Mars is home to Olympus Mons, the tallest volcano in our solar system.",
      "Jupiter spins quickly, causing its clouds to form colorful bands and giant storms.",
      "Saturn's rings are made of icy chunks, some as small as a grain of sand.",
      "Neptune, vivid blue and windy, is the furthest planet from the Sun.",
      "Black holes twist space and time, hiding light beyond the event horizon.",
      "Pulsars are rotating neutron stars that beam radio pulses like cosmic lighthouses.",
      "At the heart of every galaxy may lurk a supermassive black hole.",
      "The Milky Way sparkles with billions of stars and hidden planets.",
      "Astronauts aboard the International Space Station see sixteen sunrises each Earth day.",
      "Comets carry ice and dust, glowing as they approach the Sun.",
      "Beyond Pluto lies the Kuiper Belt, a realm of icy worlds and dwarf planets.",
      "Supernovae mark the explosive end of massive stars' lives, scattering heavy elements.",
      "Solar eclipses occur when the Moon passes exactly between Earth and the Sun."
    ]
  },
  general: {
    display: "General",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    items: [
      "Typing quickly and accurately is a valuable skill for students and professionals.",
      "Practice makes perfect. Regularly typing helps develop muscle memory.",
      "Keeping your wrists straight and seated correctly can prevent fatigue and injury.",
      "Strong reading habits can improve both your vocabulary and your writing skills.",
      "Exploring new hobbies helps boost creativity and reduces stress.",
      "Healthy lifestyle choices include balanced meals, exercise, and restful sleep.",
      "Good communication is key to teamwork and achieving goals.",
      "Stay curious! Asking questions leads to deeper knowledge.",
      "Taking breaks during study can help your brain process and retain information.",
      "Laughter is a universal language and can brighten anyone's day.",
      "Listening to music while working can boost mood and focus for many people.",
      "Organizing your day with a to-do list increases productivity and clarity.",
      "Trying new foods broadens horizons and introduces fresh flavors.",
      "Gratitude and reflection are simple habits for a happier mindset."
    ]
  },
  science: {
    display: "Science",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/DNA_double_helix_horizontal.png/400px-DNA_double_helix_horizontal.png",
    items: [
      "The scientific method begins with questioning, then observing, hypothesizing, and experimenting.",
      "Lightning is an electrical discharge caused by imbalances between clouds and Earth's surface.",
      "The process of photosynthesis allows plants to turn sunlight into usable energy.",
      "Water expands as it freezes because its molecules arrange into a crystalline structure.",
      "A light-year measures the distance light travels in a year, about 9.46 trillion kilometers.",
      "Scientific discovery relies on the idea that results must be observable and repeatable.",
      "Vaccines train the immune system to recognize and defend against certain pathogens.",
      "Sound waves travel faster through liquids and solids than through air.",
      "Newton’s laws of motion describe inertia, acceleration, and action-reaction forces.",
      "All living things are composed of one or more cells, the basic units of life."
    ]
  },
  biology: {
    display: "Biology",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Biological_cell.svg",
    items: [
      "Cells are the building blocks of all living organisms.",
      "DNA contains genetic instructions vital for development and functioning.",
      "Mammals are distinguished by their ability to nurse their young with milk.",
      "Photosynthesis provides the energy plants need to grow.",
      "Evolution explains the diversity of life through gradual genetic change.",
      "The human body includes hundreds of bones and trillions of cells.",
      "Microorganisms play essential roles in digestion and nutrient recycling.",
      "The brain controls memory, thought, movement, and emotion.",
      "Pollination is critical for the reproduction of many flowering plants.",
      "Blood transports oxygen from the lungs to the rest of the body."
    ]
  },
  engineering: {
    display: "Engineering",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gears_animation.gif/340px-Gears_animation.gif",
    items: [
      "Engineering brings math and science together to solve real-world problems.",
      "Bridges harness principles of tension, compression, and balance.",
      "Engineers design renewable energy systems to create a sustainable planet.",
      "The wheel and axle are among the earliest and most important machines.",
      "Coding and computer engineering drive advancements in every industry.",
      "Civil engineers create safe, efficient roads, bridges, and city layouts.",
      "Robotics combines mechanical, electrical, and computer engineering skills.",
      "Sustainable engineering aims to minimize environmental impacts.",
      "Aerodynamics explains how airplanes and rockets achieve flight.",
      "Every smartphone is an example of dozens of engineering marvels working together."
    ]
  },
  ai: {
    display: "AI & Technology",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Brain_network.svg/400px-Brain_network.svg.png",
    items: [
      "Artificial intelligence enables computers to solve problems and learn from data.",
      "Machine learning helps recommend new music, movies, and even social media feeds.",
      "Speech recognition lets you talk to devices and have them respond intelligently.",
      "Robots perform precise, repetitive jobs in factories and help in surgeries.",
      "Autonomous vehicles use sensors and AI to navigate roads safely.",
      "Computer vision lets programs recognize faces, objects, and handwriting.",
      "Language models like chatbots can answer questions and assist with tasks.",
      "The digital age brings massive amounts of information to our fingertips.",
      "Tech innovation is driven by a desire to automate difficult or mundane tasks.",
      "Cybersecurity protects important personal and business information from threats."
    ]
  }
};

// Tier system upgrades at these levels
const tiers = [
  {name: "Mercury Novice", minLevel: 1, color: "#ffcc32"},
  {name: "Venus Voyager", minLevel: 4, color: "#fca982"},
  {name: "Mars Explorer", minLevel: 8, color: "#f94d56"},
  {name: "Jupiter Captain", minLevel: 16, color: "#29b4dd"},
  {name: "Saturn Navigator", minLevel: 25, color: "#b18dbe"},
  {name: "Neptune Commander", minLevel: 40, color: "#8eacf3"},
  {name: "Galactic Legend", minLevel: 60, color: "#6ff2f0"}
];

// ------------- DOM Elements -------------
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

// ------------- App State -------------
let theme = "space", allItems = THEMES.space.items;
let currentLevel = 1, tier = tiers[0], currentParagraph = "", startTime = null;
let totalTyped = 0, totalErrors = 0, showFeedback = false;
let stats = JSON.parse(localStorage.getItem('stats_v2')) || {
  completed: 0, totalWPM: 0, totalAccuracy: 0, bestWPM: 0, bestAccuracy: 0
};

// ------------- Tier/Level Logic -------------
function updateTier() {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (currentLevel >= tiers[i].minLevel) {
      if (tier.name !== tiers[i].name) showTierMessage(tiers[i].name, tiers[i].color);
      tier = tiers[i];
      break;
    }
  }
  tierBadge.textContent = tier.name;
  tierBadge.style.color = tier.color;
}
function showTierMessage(name, color) {
  let msg = document.createElement('div');
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

// ------------- Theme / Content Logic -------------
function switchTheme(newTheme) {
  theme = newTheme;
  allItems = THEMES[theme].items;
  const img = THEMES[theme].image;
  themeImage.innerHTML = img ? `<img src="${img}" alt="${THEMES[theme].display}">` : "";
  startNewChallenge();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme')===theme);
  });
}

// ------------- Typing Game Logic -------------
function pickParagraph() {
  return allItems[Math.floor(Math.random() * allItems.length)];
}
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

// Updates stats dashboard at bottom
function updateStatsDisplay() {
  completedDisplay.textContent = stats.completed;
  bestWPMDisplay.textContent = stats.bestWPM;
  avgWPMDisplay.textContent = stats.completed === 0 ? 0 : Math.round(stats.totalWPM / stats.completed);
  bestAccuracyDisplay.textContent = stats.bestAccuracy + "%";
}

// Real-time WPM/accuracy and progress
function calculateStats() {
  if(!startTime) return {wpm:0, accuracy: 100};
  let now = new Date();
  let timeInMinutes = (now - startTime) / 1000 / 60;
  let chars = input.value.length;
  let wordsTyped = chars / 5;
  let wpm = Math.round(wordsTyped / (timeInMinutes || 1e-3));
  let accuracy = chars === 0 ? 100 : Math.max(0, Math.round(((chars - totalErrors) / chars) * 100));
  wpmDisplay.textContent = isFinite(wpm) && wpm > 0 ? wpm : 0;
  accuracyDisplay.textContent = accuracy;
  return {wpm, accuracy};
}

// Typing check
function checkInput(evt) {
  let typed = input.value;
  if(!startTime && typed.length) startTime = new Date();
  totalTyped = typed.length; totalErrors = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] !== currentParagraph[i]) totalErrors++;
  calculateStats();
  progressBar.value = Math.min((typed.length / currentParagraph.length) * 100, 100);
  // When complete, disable textarea and show popup
  if (typed === currentParagraph && !showFeedback) {
    input.disabled = true;
    showFeedback = true;
    setTimeout(()=>showPopup(),180);
  }
}

// Show feedback popup
function showPopup() {
  let {wpm, accuracy} = calculateStats();
  // Update stats in storage
  stats.completed++; stats.totalWPM += wpm; stats.totalAccuracy += accuracy;
  if (wpm > stats.bestWPM) stats.bestWPM = wpm;
  if (accuracy > stats.bestAccuracy) stats.bestAccuracy = accuracy;
  localStorage.setItem("stats_v2", JSON.stringify(stats));
  updateStatsDisplay();

  popupStats.innerHTML = `
    <ul style="text-align:left; line-height:1.7; margin-bottom:0.9rem;">
      <li><strong>WPM:</strong> ${wpm}</li>
      <li><strong>Accuracy:</strong> ${accuracy}%</li>
      <li><strong>Paragraph Completed:</strong> ${stats.completed}</li>
      <li><strong>Tier:</strong> ${tier.name}</li>
      <li><strong>Level:</strong> ${currentLevel}</li>
    </ul>
    <span style="font-size:1.01rem;">${accuracy > 95 ? "Excellent! 🌟" : accuracy > 80 ? "Great! Keep improving! 🚀" : "Good! Practice boosts skill! 💪"}</span>
  `;
  popupContainer.classList.remove('popup-hide');
  // Automatically go to next on Enter
  document.onkeydown = function(evt){
    if(evt.key==="Enter"){ evt.preventDefault(); closePopupBtn.click();}
  }
}
function hidePopup() {
  popupContainer.classList.add('popup-hide');
  document.onkeydown = null;
  // Level up after closing popup
  currentLevel++; updateTier(); startNewChallenge();
}

// ------------- Event Listeners -------------
input.addEventListener("input", checkInput);
input.addEventListener("keydown", function(evt){
  // Submit (show popup) with Enter when finished, but do not insert linebreaks
  if(evt.key==="Enter" && input.value === currentParagraph){evt.preventDefault();showPopup();}
});
nextBtn.addEventListener("click", ()=>{ currentLevel++; updateTier(); startNewChallenge(); });
closePopupBtn.addEventListener("click", hidePopup);

document.querySelectorAll('.tab-btn').forEach(btn => btn.onclick=()=>switchTheme(btn.getAttribute('data-theme')));

// RESET function for demo: Ctrl+Shift+R
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

// ------------- Init -------------
switchTheme(theme);
updateTier();
updateStatsDisplay();
startNewChallenge();
// [end]
