import React, { useEffect, useState, useRef } from 'react'

// ── Day / time helpers ──────────────────────────────────────────────
const DAYS    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const getDayInfo = () => {
  const now  = new Date()
  const day  = DAYS[now.getDay()]
  const date = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  const h    = now.getHours()
  const m    = String(now.getMinutes()).padStart(2, '0')
  const s    = String(now.getSeconds()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h % 12 || 12
  const time = `${h12}:${m}:${s} ${ampm}`
  const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'
  return { day, date, time, greeting, hour: h }
}

// Day-specific tip shown in the UI
const DAY_TIPS = {
  Sunday:    '🌿 Rest day — recharge for the week ahead.',
  Monday:    '🚀 New week, new goals. Let\'s get it!',
  Tuesday:   '🔥 Second gear — keep the momentum.',
  Wednesday: '⚡ Midweek surge — you\'re halfway there.',
  Thursday:  '🎯 Almost Friday — finish strong.',
  Friday:    '🎉 Last push before the weekend!',
  Saturday:  '✨ Weekend mode — enjoy your time.',
}
// ───────────────────────────────────────────────────────────────────

const App = () => {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [information, setInformation] = useState("")
  const [voices, setVoice] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [waveActive, setWaveActive] = useState(false)
  const [dayInfo, setDayInfo] = useState(getDayInfo)   // ← live clock state
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const barsRef = useRef([])

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  const loadVoice = () => {
    const allVoice = window.speechSynthesis.getVoices()
    setVoice(allVoice)
  }

  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoice
    } else {
      setTimeout(loadVoice, 0)
    }

    // Init bar heights for wave
    barsRef.current = Array.from({ length: 32 }, () => Math.random() * 20 + 4)

    // Live clock — ticks every second, updates day too (handles midnight rollover)
    const clockTick = setInterval(() => setDayInfo(getDayInfo()), 1000)
    return () => clearInterval(clockTick)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bars = barsRef.current
      const barW = canvas.width / bars.length
      const centerY = canvas.height / 2

      bars.forEach((h, i) => {
        const x = i * barW
        const active = waveActive || isSpeaking
        const targetH = active ? Math.random() * 40 + 8 : Math.random() * 6 + 3
        barsRef.current[i] = bars[i] + (targetH - bars[i]) * 0.15

        const alpha = active ? 0.9 : 0.35
        const hue = 190 + i * 2
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${alpha})`
        ctx.beginPath()
        ctx.roundRect(x + 2, centerY - barsRef.current[i] / 2, barW - 4, barsRef.current[i], 2)
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [waveActive, isSpeaking])

  const startListening = () => {
    recognition.start()
    setIsListening(true)
    setWaveActive(true)
  }

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript.toLowerCase()
    setTranscript(spokenText)
    handleVoiceCommand(spokenText)
  }

  recognition.onend = () => {
    setIsListening(false)
    setWaveActive(false)
  }

  const speakText = (text) => {
    if (voices.length === 0) return
    const utterance = new SpeechSynthesisUtterance(text)
    const maleEnglishVoice =
      voices.find((v) => v.lang.startsWith('en-') && v.name.toLowerCase().includes('male')) ||
      voices.find((v) => v.lang.startsWith('en-')) ||
      voices[0]
    utterance.voice = maleEnglishVoice
    utterance.lang = maleEnglishVoice?.lang || 'en-US'
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleVoiceCommand = async (command) => {
    if (command.startsWith('open ')) {
      const site = command.split('open ')[1].trim()
      const sitesMap = {
        youtube: 'https://www.youtube.com',
        facebook: 'https://www.facebook.com',
        google: 'https://www.google.com',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com',
      }
      if (sitesMap[site]) {
        speakText(`Opening ${site}`)
        window.open(sitesMap[site], '_blank')
        setInformation(`Opened ${site}`)
      } else {
        speakText(`I don't know how to open ${site}`)
        setInformation(`Could not find the website for ${site}`)
      }
      return
    }

    // ── Day / Date / Time commands ────────────────────────────────
    if (
      command.includes('what day is it') ||
      command.includes('what is today') ||
      command.includes("today's day") ||
      command.includes('which day')
    ) {
      const { day, date, greeting } = getDayInfo()
      const response = `${greeting}! Today is ${day}, ${date}.`
      speakText(response); setInformation(response); return
    }

    if (
      command.includes('what is the date') ||
      command.includes("today's date") ||
      command.includes('current date') ||
      command.includes('what date')
    ) {
      const { date } = getDayInfo()
      const response = `Today's date is ${date}.`
      speakText(response); setInformation(response); return
    }

    if (
      command.includes('what time') ||
      command.includes('current time') ||
      command.includes('what is the time')
    ) {
      const { time } = getDayInfo()
      const response = `The current time is ${time}.`
      speakText(response); setInformation(response); return
    }

    if (
      command.includes('what day is tomorrow') ||
      command.includes("tomorrow's day")
    ) {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
      const tDay = DAYS[tomorrow.getDay()]
      const response = `Tomorrow is ${tDay}.`
      speakText(response); setInformation(response); return
    }

    if (
      command.includes('what day was yesterday') ||
      command.includes("yesterday's day")
    ) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
      const yDay = DAYS[yesterday.getDay()]
      const response = `Yesterday was ${yDay}.`
      speakText(response); setInformation(response); return
    }
    // ─────────────────────────────────────────────────────────────

    if (command.includes('what is your name')) {
      const { greeting } = getDayInfo()
      const response = `${greeting}! I'm Friday, your voice assistant.`
      speakText(response); setInformation(response); return
    } else if (command.includes('hello friday')) {
      const { greeting, day } = getDayInfo()
      const response = `${greeting}! Happy ${day}. How can I help you?`
      speakText(response); setInformation(response); return
    } else if (command.includes('what is your age')) {
      const response = "Hello Sir, I'm just 2 days old!"
      speakText(response); setInformation(response); return
    }

    const famousPeople = [
      'bill gates','mark zuckerberg','elon musk','steve jobs','warren buffet',
      'barack obama','jeff bezos','sundar pichai','mukesh ambani','virat kohli',
      'sachin tendulkar','brian lara',
    ]

    if (famousPeople.some((p) => command.includes(p))) {
      const person = famousPeople.find((p) => command.includes(p))
      const personData = await fetchPersonData(person)
      if (personData) {
        const infoText = `${personData.name}, ${personData.extract}`
        setInformation(infoText); speakText(infoText); performGoogleSearch(command)
      } else {
        speakText("I couldn't find detailed information"); performGoogleSearch(command)
      }
    } else {
      const fallbackMessage = `Here is the information about ${command}`
      speakText(fallbackMessage); performGoogleSearch(command)
    }
  }

  const fetchPersonData = async (person) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(person)}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data?.title && data?.extract) return { name: data.title, extract: data.extract.split('.')[0] }
      return null
    } catch { return null }
  }

  const performGoogleSearch = (query) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
  }

  const statusLabel = isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Idle'
  const statusColor = isListening ? '#00e5ff' : isSpeaking ? '#b48eff' : '#4a5568'

  return (
    <div className="root-bg">
      <div className="grid-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="shell">
        {/* Header bar */}
        <div className="top-bar">
          <span className="top-bar-dot red" /><span className="top-bar-dot yellow" /><span className="top-bar-dot green" />
          <span className="top-bar-title">FRIDAY — Neural Interface v2.0</span>
          <span className="top-bar-status" style={{ color: statusColor }}>● {statusLabel}</span>
        </div>

        {/* ── Day banner ── */}
        <div className="day-banner">
          <div className="day-banner-left">
            <span className="day-pill">{dayInfo.day}</span>
            <span className="day-date">{dayInfo.date}</span>
          </div>
          <div className="day-tip">{DAY_TIPS[dayInfo.day]}</div>
          <div className="day-clock">{dayInfo.time}</div>
        </div>

        <div className="main-panel">
          {/* Avatar column */}
          <div className="avatar-col">
            <div className={`avatar-ring ${isListening ? 'ring-listen' : ''} ${isSpeaking ? 'ring-speak' : ''}`}>
              <div className="avatar-ring-inner">
                <div className="avatar-circle">
                  <svg viewBox="0 0 80 80" className="avatar-svg">
                    <defs>
                      <radialGradient id="ag" cx="40%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#c9d6ff" />
                        <stop offset="100%" stopColor="#2d3561" />
                      </radialGradient>
                    </defs>
                    <circle cx="40" cy="40" r="38" fill="url(#ag)" />
                    <ellipse cx="28" cy="34" rx="6" ry="7" fill="#00e5ff" opacity="0.9" />
                    <ellipse cx="52" cy="34" rx="6" ry="7" fill="#00e5ff" opacity="0.9" />
                    <circle cx="28" cy="34" r="3" fill="#001f3f" />
                    <circle cx="52" cy="34" r="3" fill="#001f3f" />
                    <path d="M28 54 Q40 62 52 54" stroke="#00e5ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <rect x="18" y="16" width="44" height="4" rx="2" fill="#00e5ff" opacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="ai-name">F·R·I·D·A·Y</h1>
            <p className="ai-tagline">{dayInfo.greeting}, Sir 👋</p>

            {/* Wave canvas */}
            <canvas ref={canvasRef} width={220} height={56} className="wave-canvas" />

            <button
              className={`mic-btn ${isListening ? 'mic-active' : ''}`}
              onClick={startListening}
              disabled={isListening}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="9" y1="22" x2="15" y2="22" />
              </svg>
              {isListening ? 'Listening…' : 'Activate Voice'}
            </button>
          </div>

          {/* Output column */}
          <div className="output-col">
            <div className="output-card transcript-card">
              <div className="card-label">
                <span className="card-dot cyan" />
                <span>Voice Input</span>
              </div>
              <p className="card-text">{transcript || 'Awaiting input…'}</p>
            </div>

            <div className="output-card info-card">
              <div className="card-label">
                <span className="card-dot violet" />
                <span>Response</span>
              </div>
              <p className="card-text">{information || `${dayInfo.greeting}! Ask me anything.`}</p>
            </div>

            <div className="cmd-chips">
              {[
                'What day is it?',
                'What time is it?',
                'What is the date?',
                'What day is tomorrow?',
                'Hello Friday',
                'Open YouTube',
              ].map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <span>System nominal</span>
          <span>◈ {dayInfo.day} — {dayInfo.date}</span>
          <span>Speech API ready</span>
        </div>
      </div>
    </div>
  )
}

export default App