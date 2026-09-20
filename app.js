// Vela Medicine Reminder POC - English Edition
const STORAGE_KEY = "vela_medications_v2";

const DEFAULT_MEDS = [
  {
    id: "med-1",
    name: "Blood pressure (Amlodipine)",
    time: "08:00",
    notes: "1 tablet after breakfast with warm water",
    taken: false,
    takenAt: null
  },
  {
    id: "med-2",
    name: "Stomach relief (Pantoprazole)",
    time: "12:30",
    notes: "1 capsule 30 minutes before lunch",
    taken: false,
    takenAt: null
  },
  {
    id: "med-3",
    name: "Vitamin D & Calcium",
    time: "20:00",
    notes: "2 tablets after dinner",
    taken: false,
    takenAt: null
  }
];

let medications = [];

// Initialize
function init() {
  loadMedications();
  renderDateAndGreeting();
  renderList();
  setupEventListeners();
}

function loadMedications() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      medications = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved medications, resetting to default", e);
      medications = [...DEFAULT_MEDS];
    }
  } else {
    medications = [...DEFAULT_MEDS];
    saveMedications();
  }
}

function saveMedications() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
}

function renderDateAndGreeting() {
  const now = new Date();
  const options = { weekday: "long", month: "short", day: "numeric" };
  const dateStr = now.toLocaleDateString("en-US", options);
  document.getElementById("currentDateStr").textContent = dateStr;

  const hour = now.getHours();
  const greetingEl = document.getElementById("greetingText");
  if (hour < 12) {
    greetingEl.textContent = "Good morning · Take good care today";
  } else if (hour < 18) {
    greetingEl.textContent = "Good afternoon · Stay hydrated & well";
  } else {
    greetingEl.textContent = "Good evening · Rest well tonight";
  }
}

function renderList() {
  const listEl = document.getElementById("medList");
  listEl.innerHTML = "";

  // Sort by time ascending
  medications.sort((a, b) => a.time.localeCompare(b.time));

  let takenCount = 0;

  medications.forEach((med) => {
    if (med.taken) takenCount++;

    const card = document.createElement("article");
    card.className = `med-card ${med.taken ? "is-taken" : ""}`;

    card.innerHTML = `
      <div class="med-header">
        <span class="med-time-tag">
          <span>⏰</span> ${escapeHtml(med.time)}
        </span>
        <div class="med-actions-top">
          <button type="button" class="btn-icon" title="Read reminder aloud" aria-label="Read aloud" data-action="speak" data-id="${med.id}">
            🔊
          </button>
          <button type="button" class="btn-icon" title="Delete reminder" aria-label="Delete" data-action="delete" data-id="${med.id}">
            🗑️
          </button>
        </div>
      </div>
      <div class="med-body">
        <h4 class="med-name">${escapeHtml(med.name)}</h4>
        <p class="med-notes">${escapeHtml(med.notes || "Take as directed")}</p>
        ${med.taken && med.takenAt ? `<div class="med-taken-time"><span>✓</span> Taken at ${escapeHtml(med.takenAt)}</div>` : ""}
      </div>
      <button type="button" class="btn-toggle-taken ${med.taken ? "checked" : "uncheck"}" data-action="toggle" data-id="${med.id}">
        ${med.taken ? "✓ Taken (tap to undo)" : "Tap to mark as taken"}
      </button>
    `;

    listEl.appendChild(card);
  });

  updateLightStatus(takenCount, medications.length);
}

function updateLightStatus(taken, total) {
  const badge = document.getElementById("todayProgressBadge");
  const lightCard = document.getElementById("lightCard");
  const lightTitle = document.getElementById("lightTitle");
  const lightDesc = document.getElementById("lightDesc");
  const bannerSub = document.getElementById("bannerSubText");

  badge.textContent = `${taken} of ${total} taken`;

  if (total > 0 && taken === total) {
    lightCard.classList.add("all-done");
    lightTitle.textContent = "Today's Light: Turned on ✨";
    lightDesc.textContent = "All medicine taken for today. The family knows Mom is fine!";
    bannerSub.textContent = "Wonderful! Today's medicine is all taken. Peace of mind for everyone.";
  } else if (taken > 0) {
    lightCard.classList.remove("all-done");
    lightTitle.textContent = `Today's Light: ${taken} of ${total} taken`;
    lightDesc.textContent = "Keep going! Once finished, the light will turn on completely.";
    bannerSub.textContent = "One tap marks your medicine as taken. The family sees your light come on.";
  } else {
    lightCard.classList.remove("all-done");
    lightTitle.textContent = "Today's Light: Waiting for medicine";
    lightDesc.textContent = "When morning medicine is taken, your light turns on for the family.";
    bannerSub.textContent = "One tap marks your medicine as taken. The family sees your light come on.";
  }
}

function toggleMedication(id) {
  const med = medications.find((m) => m.id === id);
  if (!med) return;

  med.taken = !med.taken;
  if (med.taken) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    med.takenAt = timeStr;
    playGentleChime();
  } else {
    med.takenAt = null;
  }

  saveMedications();
  renderList();
}

function deleteMedication(id) {
  const med = medications.find((m) => m.id === id);
  if (!med) return;
  if (confirm(`Are you sure you want to remove the reminder for "${med.name}"?`)) {
    medications = medications.filter((m) => m.id !== id);
    saveMedications();
    renderList();
  }
}

function speakMedication(id) {
  const med = medications.find((m) => m.id === id);
  if (!med) return;

  if (!("speechSynthesis" in window)) {
    alert("Speech synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const text = `Reminder for ${med.time}. Please take ${med.name}. Instructions: ${med.notes || "Take as directed"}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// Gentle audio feedback with Web Audio API
function playGentleChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.35); // G5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch (e) {
    // Ignore audio context errors if blocked by browser policy
  }
}

function setupEventListeners() {
  const listEl = document.getElementById("medList");
  listEl.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "toggle") {
      toggleMedication(id);
    } else if (action === "speak") {
      speakMedication(id);
    } else if (action === "delete") {
      deleteMedication(id);
    }
  });

  // Modal controls
  const addModal = document.getElementById("addModal");
  const openModalBtn = document.getElementById("openAddModalBtn");
  const closeModalBtn = document.getElementById("closeAddModalBtn");
  const cancelAddBtn = document.getElementById("cancelAddBtn");
  const addForm = document.getElementById("addMedForm");

  const showModal = () => {
    addModal.hidden = false;
    document.getElementById("medName").focus();
  };

  const hideModal = () => {
    addModal.hidden = true;
    addForm.reset();
    document.getElementById("medTime").value = "08:00";
  };

  openModalBtn.addEventListener("click", showModal);
  closeModalBtn.addEventListener("click", hideModal);
  cancelAddBtn.addEventListener("click", hideModal);

  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) hideModal();
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("medName").value.trim();
    const time = document.getElementById("medTime").value.trim();
    const notes = document.getElementById("medNotes").value.trim();

    if (!name || !time) return;

    const newMed = {
      id: "med-" + Date.now(),
      name,
      time,
      notes: notes || "Take as directed",
      taken: false,
      takenAt: null
    };

    medications.push(newMed);
    saveMedications();
    renderList();
    hideModal();
  });

  // Reset Today Button
  document.getElementById("resetTodayBtn").addEventListener("click", () => {
    medications.forEach((m) => {
      m.taken = false;
      m.takenAt = null;
    });
    saveMedications();
    renderList();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", init);
