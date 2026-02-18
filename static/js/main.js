/* ═══════════════════════════════════════════════════════════════════════════
   SCRIPTORIA — Main JavaScript
   SPA logic: landing → modal → dashboard → generate → export
═══════════════════════════════════════════════════════════════════════════ */

"use strict";

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  userName: "",
  results: {},
  generating: false,
  activeSection: "input",
};

const SECTION_META = {
  screenplay: { icon: "📜", title: "Screenplay", color: "#d4af37" },
  characters: { icon: "👤", title: "Character Profiles", color: "#00b4d8" },
  sound_design: { icon: "🎵", title: "Sound Design Plan", color: "#9b59b6" },
  script_breakdown: { icon: "📋", title: "Script Breakdown", color: "#2ecc71" },
  shot_list: { icon: "🎬", title: "Shot List", color: "#e74c3c" },
};

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  spawnParticles();
  initCharCounter();
  checkExistingSession();
});

function checkExistingSession() {
  fetch("/get_user")
    .then((r) => r.json())
    .then((data) => {
      if (data.name) {
        state.userName = data.name;
        // Check if there are cached results
        fetch("/get_results")
          .then((r) => r.json())
          .then((results) => {
            if (Object.keys(results).length > 0) {
              state.results = results;
              enterApp(true);
            }
          });
      }
    })
    .catch(() => {}); // Silent fail — first visit
}

// ── Particles ──────────────────────────────────────────────────────────────
function spawnParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${50 + Math.random() * 50}%;
      animation-duration: ${4 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// ── Char counter ───────────────────────────────────────────────────────────
function initCharCounter() {
  const ta = document.getElementById("story-input");
  const counter = document.getElementById("char-count");
  if (!ta || !counter) return;
  ta.addEventListener("input", () => {
    counter.textContent = ta.value.length;
    counter.style.color = ta.value.length > 2700 ? "#e74c3c" : "";
  });
}

// ── Landing → Modal ────────────────────────────────────────────────────────
function showUserModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("hidden");
  setTimeout(() => document.getElementById("input-name").focus(), 300);
}

function closeModalOutside(event) {
  if (event.target === document.getElementById("modal-overlay")) {
    // Only close if name already set
    if (state.userName) closeModal();
  }
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

async function submitName() {
  const input = document.getElementById("input-name");
  const name = input.value.trim();
  if (!name) {
    input.style.borderColor = "#e74c3c";
    input.placeholder = "Please enter your name...";
    setTimeout(() => {
      input.style.borderColor = "";
    }, 1500);
    return;
  }

  const btn = document.getElementById("btn-submit-name");
  btn.disabled = true;
  btn.textContent = "Entering...";

  try {
    const res = await fetch("/set_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.success) {
      state.userName = data.name;
      closeModal();
      enterApp(false);
    }
  } catch (err) {
    showToast("⚠️ Could not save name. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Enter the Studio →";
  }
}

// ── Page transitions ───────────────────────────────────────────────────────
function enterApp(hasResults) {
  // Swap pages
  document.getElementById("page-landing").classList.remove("active");
  document.getElementById("page-landing").classList.add("hidden");
  document.getElementById("page-app").classList.remove("hidden");
  document.getElementById("page-app").classList.add("active");

  // Set greeting
  document.getElementById("topbar-name").textContent =
    state.userName || "Director";

  // If we have cached results, unlock sidebar
  if (hasResults) {
    unlockAllSections();
    buildExportPanel(Object.keys(state.results)[0]);
    setStatus("active", "Ready");
  }
}

// ── Section navigation ─────────────────────────────────────────────────────
function showSection(key) {
  const btn = document.getElementById(`nav-${key}`);
  if (btn && btn.classList.contains("locked")) return;

  // Hide all
  document.querySelectorAll(".content-section").forEach((s) => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));

  // Show target
  const section = document.getElementById(`section-${key}`);
  if (section) {
    section.classList.remove("hidden");
    section.classList.add("active");
  }
  if (btn) btn.classList.add("active");

  state.activeSection = key;

  // Populate content if empty
  if (section && !section.querySelector(".output-card") && state.results[key]) {
    renderSection(key, state.results[key]);
  }

  // Update export panel for this section
  if (state.results[key]) buildExportPanel(key);
}

// ── Go back to story input ─────────────────────────────────────────────────
function goToInput() {
  // Deactivate all nav items
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));

  // Hide all content sections
  document.querySelectorAll(".content-section").forEach((s) => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });

  // Show the input section
  const inputSection = document.getElementById("section-input");
  if (inputSection) {
    inputSection.classList.remove("hidden");
    inputSection.classList.add("active");
  }

  state.activeSection = "input";

  // Focus the textarea so the user can start typing immediately
  const ta = document.getElementById("story-input");
  if (ta) {
    ta.focus();
    ta.select();
  }
}


// ── Generate ───────────────────────────────────────────────────────────────
async function generateContent() {
  if (state.generating) return;

  const story = document.getElementById("story-input").value.trim();
  if (!story) {
    showToast("✍️ Please enter your story concept first.");
    document.getElementById("story-input").focus();
    return;
  }
  if (story.length < 20) {
    showToast("✍️ Please provide more detail about your story.");
    return;
  }

  state.generating = true;
  setGeneratingUI(true);
  setStatus("loading", "Generating...");

  // Show progress tracker
  const tracker = document.getElementById("progress-tracker");
  tracker.classList.remove("hidden");
  resetProgress();

  // Animate progress items while waiting
  const keys = Object.keys(SECTION_META);
  const progressInterval = animateProgress(keys);

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story }),
    });

    clearInterval(progressInterval);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Generation failed");
    }

    const data = await res.json();
    state.results = data.results;

    // Mark all done
    keys.forEach((k) => setProgressDone(k));

    // Unlock sidebar
    unlockAllSections();
    buildExportPanel(keys[0]);
    setStatus("active", "Complete");
    showToast(
      "✅ Production package generated! Select a deliverable from the sidebar.",
    );

    // Auto-navigate to screenplay
    setTimeout(() => showSection("screenplay"), 800);
  } catch (err) {
    clearInterval(progressInterval);
    keys.forEach((k) => setProgressError(k));
    setStatus("error", "Error");
    showToast(`❌ ${err.message}`);
    console.error(err);
  } finally {
    state.generating = false;
    setGeneratingUI(false);
  }
}

function setGeneratingUI(on) {
  const btn = document.getElementById("btn-generate");
  const icon = document.getElementById("btn-generate-icon");
  const text = document.getElementById("btn-generate-text");

  if (on) {
    btn.disabled = true;
    btn.classList.add("generating");
    icon.outerHTML = `<span id="btn-generate-icon" class="spinner"></span>`;
    text.textContent = "Generating...";
  } else {
    btn.disabled = false;
    btn.classList.remove("generating");
    document.getElementById("btn-generate-icon").outerHTML =
      `<span id="btn-generate-icon">⚡</span>`;
    document.getElementById("btn-generate-text").textContent =
      "Generate Production Package";
  }
}

// ── Progress helpers ───────────────────────────────────────────────────────
function resetProgress() {
  Object.keys(SECTION_META).forEach((k) => {
    const item = document.getElementById(`prog-${k}`);
    if (item) {
      item.classList.remove("done", "error");
      item.querySelector(".prog-status").textContent = "⏳";
    }
  });
}

function animateProgress(keys) {
  let idx = 0;
  return setInterval(() => {
    if (idx < keys.length) {
      const item = document.getElementById(`prog-${keys[idx]}`);
      if (item) {
        item.querySelector(".prog-status").innerHTML =
          '<span class="spinner" style="width:12px;height:12px;border-width:1.5px;border-top-color:#d4af37;border-color:rgba(212,175,55,0.2)"></span>';
      }
      idx++;
    }
  }, 2000);
}

function setProgressDone(key) {
  const item = document.getElementById(`prog-${key}`);
  if (item) {
    item.classList.add("done");
    item.querySelector(".prog-status").textContent = "✅";
  }
}

function setProgressError(key) {
  const item = document.getElementById(`prog-${key}`);
  if (item) {
    item.classList.add("error");
    item.querySelector(".prog-status").textContent = "❌";
  }
}

// ── Unlock sidebar ─────────────────────────────────────────────────────────
function unlockAllSections() {
  Object.keys(SECTION_META).forEach((key) => {
    const btn = document.getElementById(`nav-${key}`);
    const lock = document.getElementById(`lock-${key}`);
    if (btn) {
      btn.classList.remove("locked");
    }
    if (lock) {
      lock.textContent = "";
    }
  });
}

// ── Render content section ─────────────────────────────────────────────────
function renderSection(key, content) {
  const section = document.getElementById(`section-${key}`);
  if (!section) return;

  const meta = SECTION_META[key];
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  section.innerHTML = `
    <div class="output-header">
      <div>
        <div class="output-title">${meta.icon} ${meta.title}</div>
        <div class="output-meta">${wordCount.toLocaleString()} words generated</div>
      </div>
    </div>
    <div class="output-card">${escapeHtml(content)}</div>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Export panel ───────────────────────────────────────────────────────────
function buildExportPanel(activeKey) {
  const panel = document.getElementById("export-panel");
  if (!panel) return;

  const sections = Object.keys(SECTION_META).filter((k) => state.results[k]);
  if (!sections.length) return;

  const currentKey = activeKey || sections[0];

  panel.innerHTML = `
    <div class="export-section-label">CURRENT: ${SECTION_META[currentKey]?.title || currentKey}</div>
    <div class="export-buttons">
      <button class="btn-export" onclick="exportContent('${currentKey}', 'txt')">
        <span>📄</span> Plain Text <span class="fmt-badge">TXT</span>
      </button>
      <button class="btn-export" onclick="exportContent('${currentKey}', 'pdf')">
        <span>📕</span> PDF Document <span class="fmt-badge">PDF</span>
      </button>
      <button class="btn-export" onclick="exportContent('${currentKey}', 'docx')">
        <span>📘</span> Word Document <span class="fmt-badge">DOCX</span>
      </button>
    </div>
    <div class="export-section-label" style="margin-top:0.75rem">ALL DELIVERABLES</div>
    <div class="export-buttons">
      ${sections
        .map(
          (k) => `
        <button class="btn-export" onclick="showSection('${k}'); buildExportPanel('${k}')" style="font-size:0.75rem">
          ${SECTION_META[k].icon} ${SECTION_META[k].title}
        </button>
      `,
        )
        .join("")}
    </div>
  `;
}

async function exportContent(contentType, fmt) {
  const content = state.results[contentType];
  if (!content) {
    showToast("⚠️ No content to export. Please generate first.");
    return;
  }

  showToast(`⏳ Preparing ${fmt.toUpperCase()} download...`);
  try {
    const res = await fetch(`/export/${contentType}/${fmt}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, story: "" }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Export failed" }));
      throw new Error(err.error || "Export failed");
    }

    // Convert response to a blob and trigger download
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scriptoria_${contentType}.${fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`✅ ${fmt.toUpperCase()} downloaded!`);
  } catch (err) {
    showToast(`❌ Export failed: ${err.message}`);
    console.error("Export error:", err);
  }
}

// ── Status bar ─────────────────────────────────────────────────────────────
function setStatus(type, text) {
  const dot = document.getElementById("status-dot");
  const span = document.getElementById("status-text");
  if (dot) {
    dot.className = `status-dot ${type}`;
  }
  if (span) {
    span.textContent = text;
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, duration = 3500) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, duration);
}
