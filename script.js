// script.js — perfectly synced version 🌿

let timerInterval;
let totalTimeInSeconds;
let secondsLeft;
let startTimestamp = 0;

const PLANT_NAME = "Sunflower";

// --- Element References ---
const selectionState = document.getElementById("selection-state");
const runningState = document.getElementById("running-state");
const timeDisplay = document.getElementById("time-display");
const progressBar = document.getElementById("progress-bar");
const statusText = document.getElementById("status-text");
const sproutStatus = document.getElementById("sprout-status");
const customInput = document.getElementById("custom-minutes");

const coffeeVisual = document.getElementById("coffee-visual");
const plantVisualContainer = document.getElementById("plant-visual-container");
const plantVideo = document.getElementById("plant-video");

// --- Helper Functions ---

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

// --- Finish and Reset ---

function finishTimer() {
  cancelAnimationFrame(timerInterval);

  statusText.textContent = `✨ Your ${PLANT_NAME.toLowerCase()} is fully grown! 🌸`;
  timeDisplay.textContent = "FINISHED!";
  progressBar.style.width = "100%";
  sproutStatus.textContent = "Fully Grown! 🎉";

  if (plantVideo) plantVideo.pause();

  setTimeout(resetTimer, 5000);
}

function resetTimer() {
  cancelAnimationFrame(timerInterval);

  plantVisualContainer.style.display = "none";
  coffeeVisual.style.display = "block";

  if (plantVideo) {
    plantVideo.pause();
    plantVideo.currentTime = 0;
    plantVideo.playbackRate = 1.0;
  }

  runningState.style.display = "none";
  selectionState.style.display = "block";

  sproutStatus.textContent = "Small Sprout 🌱";
  customInput.value = "";
}

// --- Accurate Timer Logic (Real-Time Sync) ---

function startTimer(minutes) {
  if (minutes <= 0 || isNaN(minutes)) {
    alert("Please enter a valid number of minutes.");
    return;
  }

  // Switch UI
  coffeeVisual.style.display = "none";
  plantVisualContainer.style.display = "block";
  selectionState.style.display = "none";
  runningState.style.display = "block";

  totalTimeInSeconds = minutes * 60;
  secondsLeft = totalTimeInSeconds;

  statusText.textContent = `Growing your ${PLANT_NAME.toLowerCase()}... 🌿`;

  // Begin when video metadata ready
  const begin = () => {
    startTimestamp = performance.now();
    plantVideo.currentTime = 0;
    plantVideo.playbackRate = 1;
    plantVideo.play();
    requestAnimationFrame(animateTimer);
  };

  if (plantVideo.readyState >= 1) begin();
  else {
    plantVideo.addEventListener("loadedmetadata", begin, { once: true });
    plantVideo.load();
  }

  updateDisplay(0);
}

function animateTimer(now) {
  if (!startTimestamp) return;

  const elapsed = (now - startTimestamp) / 1000;
  const progress = Math.min(elapsed / totalTimeInSeconds, 1);
  secondsLeft = Math.ceil(totalTimeInSeconds - elapsed);

  // Update time display and progress
  updateDisplay(progress);

  // Keep video perfectly synced
  if (plantVideo && plantVideo.duration > 0) {
    plantVideo.currentTime = progress * plantVideo.duration;
  }

  if (progress < 1) timerInterval = requestAnimationFrame(animateTimer);
  else finishTimer();
}

function updateDisplay(progress) {
  timeDisplay.textContent = formatTime(secondsLeft) + " left";
  progressBar.style.width = `${progress * 100}%`;

  if (progress < 0.25) sproutStatus.textContent = "Small Seedling 🌱";
  else if (progress < 0.75) sproutStatus.textContent = "Growing Sprout 🌿";
  else if (progress < 1) sproutStatus.textContent = "Budding Plant 🌼";
}

function startCustomTimer() {
  const minutes = parseInt(customInput.value);
  startTimer(minutes);
}

function stopTimer() {
  if (confirm("Are you sure you want to stop? Your plant will wither.")) {
    cancelAnimationFrame(timerInterval);
    resetTimer();
  }
}

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
  if (plantVisualContainer) plantVisualContainer.style.display = "none";
  if (coffeeVisual) coffeeVisual.style.display = "block";
  if (plantVideo) plantVideo.pause();
});
