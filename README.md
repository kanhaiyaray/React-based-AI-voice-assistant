<div align="center">

# AI Voice Assistant

**A React-powered voice assistant with real-time speech recognition, day-aware intelligence, and a futuristic holographic UI.**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Native-4dabf7?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

*"Good Morning, Sir. Today is Wednesday. How can I help you?"*

</div>

---

## 📖 About

 **(Fully Responsive Intelligent Digital Assistant, Your Assistant) is a browser-based AI voice assistant built with React. Inspired by Iron Man's J.A.R.V.I.S., it listens to your natural voice commands, processes them in real time, and responds with synthesized speech — all wrapped in a sci-fi holographic interface.

The assistant is day-aware: every time you open it, it reads the actual current day, date, and time from your system clock — so it never says "Friday" if it's actually a Monday.

---

## ✨ Features

### 🎙️ Voice Intelligence
- Real-time voice recognition using the **Web Speech API**
- Natural text-to-speech responses via the **SpeechSynthesis API**
- Automatically selects a male English voice if available

### 📅 Day & Time Awareness
- Shows the **real current day** on every visit (Sunday, Monday, Tuesday…)
- Live clock that ticks every second — including midnight rollover
- Dynamic greetings: *Good Morning / Good Afternoon / Good Evening*
- Day-specific motivational tips (e.g. *"🚀 New week, new goals"* on Monday)

### 🗣️ Voice Commands Supported

| Command | Response |
|---|---|
| *"What day is it?"* | Speaks the current day and full date |
| *"What time is it?"* | Speaks the current time |
| *"What is the date?"* | Speaks today's full date |
| *"What day is tomorrow?"* | Calculates and speaks tomorrow's day |
| *"What day was yesterday?"* | Calculates and speaks yesterday's day |
| *"Hello Friday"* | Greets with current day context |
| *"What is your name?"* | Introduces itself with time-aware greeting |
| *"Open YouTube"* | Opens YouTube in a new tab |
| *"Open Google / Facebook / Instagram / Twitter"* | Opens respective site |
| *"Tell me about Elon Musk"* | Fetches Wikipedia summary + Google search |
| *"Tell me about [any famous person]"* | Wikipedia info + Google search fallback |

### 🎨 Holographic UI
- Animated **orbital rings** around the AI avatar (speed up while listening/speaking)
- Real-time **canvas waveform visualizer** reacting to voice activity
- **Day banner** with glowing day pill, live clock, and day tip
- Ambient floating orbs and subtle grid overlay
- macOS-style top bar with live status indicator
- Fully **responsive** for mobile screens

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **React 18+** | UI framework & state management |
| **Web Speech API** | Voice recognition (`SpeechRecognition`) |
| **SpeechSynthesis API** | Text-to-speech output |
| **Wikipedia REST API** | Fetches person summaries |
| **Canvas API** | Live waveform animation |
| **CSS Animations** | Orbital rings, orbs, transitions |
| **Google Fonts** | Orbitron · Share Tech Mono · Inter |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- A modern browser with Web Speech API support (Chrome recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/friday-voice-assistant.git

# 2. Navigate into the project
cd friday-voice-assistant

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> ⚠️ **Note:** The Web Speech API requires a **microphone permission** grant from the browser. Chrome works best; Firefox has limited support.

---

## 📁 Project Structure

```
friday-voice-assistant/
├── src/
│   ├── App.jsx          # Main component — voice logic, commands, UI
│   ├── index.css        # Holographic UI styles & animations
│   └── ai-human.avif    # (Optional) AI avatar image
├── public/
├── index.html
├── package.json
└── README.md
```

---

## 🎤 How to Use

1. Click **"Activate Voice"** and allow microphone access
2. Speak a command clearly (e.g. *"What day is it?"*)
3. Friday will respond with synthesized speech and display the answer
4. The waveform visualizer reacts in real time while you speak or Friday responds

---

## 🔮 Roadmap

- [ ] Add weather voice command (`"What's the weather today?"`)
- [ ] Add alarm / reminder setting via voice
- [ ] Persistent conversation history
- [ ] Custom wake word detection (`"Hey Friday"`)
- [ ] Mobile PWA support
- [ ] More famous people in the knowledge base

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
# Fork → Clone → Create branch → Commit → Push → Pull Request
git checkout -b feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using React & Web Speech API

</div>
