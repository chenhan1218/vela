// Vela Medicine Reminder POC
const STORAGE_KEY = "vela_medications_v1";

const DEFAULT_MEDS = [
  {
    id: "med-1",
    name: "降血壓藥 (Amlodipine)",
    time: "08:00",
    notes: "早上飯後 1 顆，請配溫開水",
    taken: false,
    takenAt: null
  },
  {
    id: "med-2",
    name: "胃藥 (Pantoprazole)",
    time: "12:30",
    notes: "午餐前 30 分鐘服用 1 包",
    taken: false,
    takenAt: null
  },
  {
    id: "med-3",
    name: "維他命 D 與鈣片",
    time: "20:00",
    notes: "晚餐後 2 顆",
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
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dayName = days[now.getDay()];
  const dateStr = `${year} 年 ${month} 月 ${date} 日 · ${dayName}`;
  document.getElementById("currentDateStr").textContent = dateStr;

  const hour = now.getHours();
  const greetingEl = document.getElementById("greetingText");
  if (hour < 11) {
    greetingEl.textContent = "早安，今天也要照顧好身體";
  } else if (hour < 17) {
    greetingEl.textContent = "午安，記得午餐後補充水分與用藥";
  } else {
    greetingEl.textContent = "晚安，願您今晚有個溫暖好眠";
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
          <button type="button" class="btn-icon" title="語音朗讀提醒" aria-label="朗讀" data-action="speak" data-id="${med.id}">
            🔊
          </button>
          <button type="button" class="btn-icon" title="刪除此用藥" aria-label="刪除" data-action="delete" data-id="${med.id}">
            🗑️
          </button>
        </div>
      </div>
      <div class="med-body">
        <h4 class="med-name">${escapeHtml(med.name)}</h4>
        <p class="med-notes">${escapeHtml(med.notes || "按時服用")}</p>
        ${med.taken && med.takenAt ? `<div class="med-taken-time"><span>✓</span> 已於 ${escapeHtml(med.takenAt)} 服用</div>` : ""}
      </div>
      <button type="button" class="btn-toggle-taken ${med.taken ? "checked" : "uncheck"}" data-action="toggle" data-id="${med.id}">
        ${med.taken ? "✓ 已服用（點擊可取消）" : "✔️ 點擊標記已服用"}
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

  badge.textContent = `${taken} / ${total} 已服用`;

  if (total > 0 && taken === total) {
    lightCard.classList.add("all-done");
    lightTitle.textContent = "今日守護燈已點亮 ✨";
    lightDesc.textContent = "今日排程已全數完成，遠方家人已收到點燈報平安通知！";
    bannerSub.textContent = "太棒了！今日用藥已全數完成，安心無憂。";
  } else if (taken > 0) {
    lightCard.classList.remove("all-done");
    lightTitle.textContent = `今日守護燈：已完成 ${taken} / ${total}`;
    lightDesc.textContent = "持續用藥中，完成後微光將會全數點亮。";
    bannerSub.textContent = "點擊按鈕即可記錄服藥，遠端家人也能即時收到安心通知。";
  } else {
    lightCard.classList.remove("all-done");
    lightTitle.textContent = "今日守護燈：等待用藥";
    lightDesc.textContent = "長輩完成用藥時，微光將會點亮並向家人報平安。";
    bannerSub.textContent = "點擊按鈕即可記錄服藥，遠端家人也能即時收到安心通知。";
  }
}

function toggleMedication(id) {
  const med = medications.find((m) => m.id === id);
  if (!med) return;

  med.taken = !med.taken;
  if (med.taken) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });
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
  if (confirm(`確定要刪除「${med.name}」的提醒嗎？`)) {
    medications = medications.filter((m) => m.id !== id);
    saveMedications();
    renderList();
  }
}

function speakMedication(id) {
  const med = medications.find((m) => m.id === id);
  if (!med) return;

  if (!("speechSynthesis" in window)) {
    alert("您的瀏覽器暫不支援語音合成功能。");
    return;
  }

  window.speechSynthesis.cancel();
  const text = `提醒您，時間 ${med.time}，請記得服用 ${med.name}。說明：${med.notes || "按時服用"}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
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
      notes: notes || "按時服用",
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
