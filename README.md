# Vela · Medicine Reminder POC

> Keep a light on for someone far away.

**Vela** is a zero-friction, anti-surveillance medicine reminder proof-of-concept built for eldercare and long-distance families. Designed with dignity and warmth at its core, it enables elderly parents to easily log their daily medications with a single tap, gently turning on "The Kept Light" so children and loved ones know they are safe without intrusive surveillance or stressful interrogations.

---

## 🌐 Live Demo & Repository

- **Live Demo (GitHub Pages)**: [https://chenhan1218.github.io/vela/](https://chenhan1218.github.io/vela/)
- **GitHub Repository**: [https://github.com/chenhan1218/vela](https://github.com/chenhan1218/vela)

---

## ✨ Key Features

1. **Zero-Friction Micro-Interactions**:
   - Ultra-large touch targets and high-contrast, accessible typography (Candle & Ink design identity).
   - One-tap check-in with automatic timestamp logging (e.g. `✓ Taken at 8:15 AM`).
2. **The Kept Light (Ambient Peace of Mind)**:
   - When all medications for the day are taken, the ambient lantern status turns on with a warm, gentle glow, reassuring family members from afar.
3. **Voice Read-Aloud (Web Speech Synthesis)**:
   - Tap the speaker icon (🔊) to hear clear spoken audio reminders for dosage, timing, and instructions.
4. **Gentle Harmonic Feedback (Web Audio API)**:
   - Soft C-E-G chime upon marking a medication as taken, providing positive tactile reassurance.
5. **Local Persistence (LocalStorage)**:
   - Works fully offline and remembers personalized medications across page reloads.
6. **Customizable Schedule**:
   - Easily add new medications, adjust timing, and customize instructions.

---

## 🚀 Quick Start

This is a pure static web application with zero external build tools or runtime dependencies.

### Run Locally
Simply open `index.html` in any browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html
```

Or serve via any static HTTP server:
```bash
# Python
python3 -m http.server 8080

# Or Node.js
npx serve .
```
Visit `http://localhost:8080`.

---

## 📂 Project Structure

```
vela/
├── index.html      # Accessible semantic HTML structure
├── style.css       # Candle & Ink design system (Literata + Inter)
├── app.js          # Medicine state manager, speech synthesis & audio chime
├── .nojekyll       # GitHub Pages direct static hosting bypass
└── README.md       # Project documentation & overview
```

