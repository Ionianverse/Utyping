// Universe, space, and general typing paragraphs (add more as you wish)
const paragraphs = [
    "Mercury, the closest planet to the Sun, completes an orbit in just 88 Earth days. Despite being closest to the Sun, it is not the hottest planet in our solar system.",
    "Venus can be seen shining brightly in our night sky, often called Earth’s twin due to its similar size. Its surface is covered with thick clouds of sulfuric acid.",
    "The red planet Mars has the tallest volcano and the deepest, longest canyon in the solar system. Scientists believe it once had liquid water flowing on its surface.",
    "Jupiter, the largest planet, contains a storm—the Great Red Spot—that has been raging for centuries. It also has dozens of fascinating moons.",
    "Saturn’s rings are composed of billions of icy particles ranging in size from grains of sand to mountain-sized chunks. Saturn’s moon Titan has lakes of methane.",
    "Uranus spins on its side, making its seasons last over 20 years each. Its blue-green color comes from methane in its atmosphere.",
    "Neptune, farthest from the Sun, has the fastest winds in the solar system, reaching up to 1,200 miles per hour.",
    "Black holes warp space and time so much that even light cannot escape. Supermassive black holes exist at the center of almost every galaxy.",
    "Our Milky Way galaxy is home to hundreds of billions of stars, many with their own planetary systems.",
    "Typing is an essential skill in the digital age. Practicing daily helps increase both speed and accuracy for school, work, and fun.",
    "Proper typing posture includes straight wrists and fingers lightly on the home row. Good habits lead to fewer mistakes and less strain.",
    "Learning to type without looking at the keyboard is known as touch typing. This technique enables faster and more efficient computer use.",
    "The International Space Station orbits Earth every 90 minutes, hosting astronauts from many countries.",
    "Curiosity and perseverance help explore both the universe and improve your typing skills—keep practicing to reach new heights!",
    "Exploring unknown worlds and gaining new skills both require patience, focus, and dedication."
];

// Tier system upgrades at these levels
const tiers = [
    {name: "Mercury Novice", minLevel: 1, color: "#FFD700"},
    {name: "Venus Voyager", minLevel: 3, color: "#FF9F1C"},
    {name: "Mars Explorer", minLevel: 6, color: "#F44336"},
    {name: "Jupiter Captain", minLevel: 10, color: "#2196F3"},
    {name: "Saturn Navigator", minLevel: 15, color: "#9367B4"},
    {name: "Neptune Commander", minLevel: 21, color: "#4F8EDB"},
    {name: "Galactic Legend", minLevel: 30, color: "#00FFF7"}
];

let currentLevel = 1, tier = tiers[0], currentParagraph = "", startTime = null;
let totalTyped = 0, totalErrors = 0;

const get = id => document.getElementById(id);
const textToTypeElement = get("text-to-type");
const input = get("typing-input");
const wpmDisplay = get("wpm");
const accuracyDisplay = get("accuracy");
const tierBadge = get("tier");
const progressBar = get("progress-bar");
const levelInfo = get("level-info");
const nextBtn = get("next-btn");

// User stat elements
const completedDisplay = get("completed");
const bestWPMDisplay = get("best-wpm");
const avgWPMDisplay = get("avg-wpm");
const bestAccuracyDisplay = get("best-accuracy");

// Load user stats from localStorage or start new
let stats = JSON.parse(localStorage.getItem('stats_v1')) || {
    completed: 0, totalWPM: 0, totalAccuracy: 0, bestWPM: 0, bestAccuracy: 0
};

// Tier selection based on progress
function updateTier() {
    for (let i = tiers.length - 1; i >= 0; i--) {
        if (currentLevel >= tiers[i].minLevel) {
            if (tier.name !== tiers[i].name) {
                showTierMessage(tiers[i].name, tiers[i].color);
            }
            tier = tiers[i];
            break;
        }
    }
    tierBadge.textContent = tier.name;
    tierBadge.style.color = tier.color;
}

// Congratulatory message on new tier
function showTierMessage(name, color) {
    let msg = document.createElement('div');
    msg.textContent = `🚀 Congratulations! New Tier Unlocked: ${name} 🚀`;
    msg.style.background = color;
    msg.style.color = "#060624";
    msg.style.position = "fixed";
    msg.style.top = "25%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.padding = "1.5rem";
    msg.style.borderRadius = "2rem";
    msg.style.fontSize = "1.3rem";
    msg.style.fontWeight = "bold";
    msg.style.boxShadow = "0 0 32px #fff";
    msg.style.zIndex = "1000";
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Show stats on the dashboard
function updateStatsDisplay() {
    completedDisplay.textContent = stats.completed;
    bestWPMDisplay.textContent = stats.bestWPM;
    avgWPMDisplay.textContent = stats.completed === 0 ? 0 : Math.round(stats.totalWPM / stats.completed);
    bestAccuracyDisplay.textContent = stats.bestAccuracy + "%";
}

// Pick a new random paragraph
function pickParagraph() {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

// Start new paragraph challenge
function startNewChallenge() {
    currentParagraph = pickParagraph();
    textToTypeElement.textContent = currentParagraph;
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
    let chars = input.value.length;
    let wordsTyped = chars / 5;
    let wpm = Math.round(wordsTyped / timeInMinutes);
    let accuracy = chars === 0 ? 100 : Math.max(0, Math.round(((chars - totalErrors) / chars) * 100));

    wpmDisplay.textContent = isFinite(wpm) && wpm > 0 ? wpm : 0;
    accuracyDisplay.textContent = accuracy;
    return {wpm, accuracy};
}

function checkInput() {
    let typed = input.value;
    totalTyped = typed.length;
    totalErrors = 0;
    for (let i = 0; i < typed.length; i++) {
