import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Heart, KeyRound, LockKeyhole, Sparkles, Flame, MessageCircle, RefreshCw, Check, X, Plus, Clock, Send, ArrowRight, ShieldCheck } from 'lucide-react'

const DEFAULT_DATA = {
  startDate: null,
  returnDate: null,
  setupComplete: false,
  setup: {},
  notes: [],
  distanceActions: [],
  reunionActions: [],
  ruinedCount: 0,
  ruinedGoal: 10,
  mode: 'distance',
  lastUpdated: null,
}

const RHYTHMS = [
  { id: '5', label: 'Short resets', days: 5, detail: 'About 5 days — frequent connection and shorter waits.' },
  { id: '10', label: 'A steady build', days: 10, detail: 'About 10 days — anticipation without making it feel heavy.' },
  { id: '20', label: 'Long anticipation', days: 20, detail: 'About 20 days — he waits and thinks about you for a while.' },
  { id: '30', label: 'The long game', days: 30, detail: 'About 30 days — the longer he waits, the better it gets.' },
  { id: 'moment', label: 'I decide in the moment', days: null, detail: 'No fixed countdown.  You decide when it feels right.' },
]

const RUINED_GOALS = [
  { value: 5, label: '5 — A taste', detail: 'A playful build. Enough to make it meaningful.' },
  { value: 10, label: '10 — The sweet spot', detail: 'A strong rhythm. Enough anticipation to feel earned.' },
  { value: 15, label: '15 — Now we are building', detail: 'More tension, more teasing, more attention on you.' },
  { value: 20, label: '20 — I like making him wait', detail: 'A serious stretch. This becomes part of the rhythm.' },
  { value: 25, label: 'More than 20 — I am not in a hurry', detail: 'For the long game. He keeps earning it.' },
]

const CONNECTION_OPTIONS = [
  'His attention on me',
  'Sweet messages',
  'Physical teasing',
  'Acts of service',
  'Daily check-ins',
  'Knowing he is thinking about me',
  'Feeling desired',
]

const TEASE_STYLES = [
  'Sweet and affectionate',
  'Playful and mischievous',
  'Quiet and subtle',
  'Confident and in control',
  'Flirty and visual',
  'Still figuring it out',
]

const RESPONSE_STYLES = [
  'Immediate attention',
  'Sweet appreciation',
  'Seeing how much he wants me',
  'Quiet obedience',
  'Playful flirting back',
  'Surprise me',
]

const DISTANCE_IDEAS = {
  'Sweet and affectionate': [
    'Send one soft goodnight message with the key mentioned once.',
    'Ask him to write three specific things he misses about you.',
    'Tell him one thing you are looking forward to when you are home.',
  ],
  'Playful and mischievous': [
    'Send one short “still locked?” message and nothing else for a while.',
    'Give him a tiny task before bed and make him report back.',
    'Send a key hint — not a full tease, just enough to make him think.',
  ],
  'Quiet and subtle': [
    'Mention the key casually once today, then let him sit with it.',
    'Ask for one simple check-in: “Tell me where your mind is.”',
    'Wait a little before approving anything. The pause is part of the attention.',
  ],
  'Confident and in control': [
    'Set one rule for tonight and make him repeat it back.',
    'Tell him exactly what you expect before bed.',
    'Remind him that full release is not the same as being unlocked.',
  ],
  'Flirty and visual': [
    'Send a small visual reminder of the key or what you are wearing.',
    'Ask him for a photo that shows how his day is going.',
    'Give him one image to think about before sleep.',
  ],
  'Still figuring it out': [
    'Start simple: one message, one reminder, one small task.',
    'Ask him what landed most today, then keep only what felt natural to you.',
    'Try a soft tease instead of a big gesture. Small counts.',
  ],
}

const HIM_IDEAS = [
  'Send her a good morning message before checking anything else.',
  'Tell her one specific thing you desire about her that is not generic.',
  'Do one practical thing she would appreciate and tell her when it is done.',
  'Ask what would make her feel pursued today, then do exactly that.',
  'Send a simple evening note: what you missed, what you noticed, and what you are looking forward to.',
]

const REUNION_MENU = [
  { id: 'oral', cat: 'Focus on her', text: 'Her pleasure first. No expectation that he finishes.' },
  { id: 'locked-sex', cat: 'Locked intimacy', text: 'Sex or teasing while he stays locked. He is present, but not released.' },
  { id: 'sleeve', cat: 'Sleeve', text: 'Use the sleeve when she wants penetration and he still does not get a full orgasm.' },
  { id: 'strap', cat: 'Strap-on over cage', text: 'When she wants him inside her while he remains locked.' },
  { id: 'ruined', cat: 'Ruined orgasm', text: 'He releases without the full satisfaction. It counts toward the goal.', counts: true },
  { id: 'cleanup', cat: 'Accident rule', text: 'If he finishes when he was not supposed to, he takes care of her afterward.' },
]

function storageKey(code) {
  return `hak:${code}:data`
}

async function loadShared(code) {
  try {
    const res = await window.storage.get(storageKey(code), true)
    if (!res?.value) return null
    return { ...DEFAULT_DATA, ...JSON.parse(res.value) }
  } catch (err) {
    console.error(err)
    return null
  }
}

async function saveShared(code, data) {
  const payload = { ...data, lastUpdated: new Date().toISOString() }
  await window.storage.set(storageKey(code), JSON.stringify(payload), true)
  return payload
}

const todayIndex = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set')
const fmtTime = (iso) => (iso ? new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '')
const daysBetween = (a, b) => Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
const uid = () => Math.random().toString(36).slice(2, 10)

function Chip({ active, children, onClick }) {
  return <button className={`chip ${active ? 'active' : ''}`} onClick={onClick} type="button">{children}</button>
}

function OptionCard({ active, title, detail, onClick }) {
  return (
    <button className={`option-card ${active ? 'selected' : ''}`} onClick={onClick} type="button">
      <span>{title}</span>
      <small>{detail}</small>
    </button>
  )
}

export default function App() {
  const [code, setCode] = useState('')
  const [role, setRole] = useState(null)
  const [activeCode, setActiveCode] = useState(null)
  const [data, setData] = useState(DEFAULT_DATA)
  const [loading, setLoading] = useState(false)
  const [screen, setScreen] = useState('home')
  const [error, setError] = useState('')

  const connect = async () => {
    if (!code.trim() || !role) return
    setLoading(true)
    setError('')
    const clean = code.trim().toLowerCase()
    try {
      const existing = await loadShared(clean)
      const seed = existing || await saveShared(clean, { ...DEFAULT_DATA, startDate: new Date().toISOString() })
      setData(seed)
      setActiveCode(clean)
      if (role === 'keyholder' && !seed.setupComplete) setScreen('setup')
      else setScreen('dashboard')
    } catch (err) {
      console.error(err)
      setError('Could not connect. Check the shared code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const refresh = useCallback(async () => {
    if (!activeCode) return
    const fresh = await loadShared(activeCode)
    if (fresh) setData(fresh)
  }, [activeCode])

  const update = async (mutator) => {
    const next = mutator({ ...data })
    setData(next)
    if (activeCode) setData(await saveShared(activeCode, next))
  }

  useEffect(() => {
    if (!activeCode) return
    const id = setInterval(refresh, 7000)
    return () => clearInterval(id)
  }, [activeCode, refresh])

  if (!activeCode) {
    return <Landing code={code} setCode={setCode} role={role} setRole={setRole} loading={loading} error={error} connect={connect} />
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mini"><Heart size={18} fill="currentColor" /> Heart & Key</div>
        <button className="ghost-btn" onClick={refresh}><RefreshCw size={16} /> Refresh</button>
      </header>

      <main className="container">
        {screen === 'setup' && <Setup data={data} update={update} goDashboard={() => setScreen('dashboard')} />}
        {screen === 'dashboard' && <Dashboard data={data} role={role} update={update} setScreen={setScreen} />}
        {screen === 'notes' && <Notes data={data} role={role} update={update} setScreen={setScreen} />}
      </main>
    </div>
  )
}

function Landing({ code, setCode, role, setRole, loading, error, connect }) {
  return (
    <main className="landing">
      <section className="landing-card">
        <div className="emblem"><Heart size={30} fill="currentColor" /></div>
        <h1>Heart & Key</h1>
        <p className="tagline">A private space for the two of you.</p>
        <p className="quote">Distance sharpens love. Presence strengthens it.</p>

        <label className="field-label">Shared pair code</label>
        <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="example: matt-nikki-2026" autoCapitalize="none" />

        <div className="role-grid">
          <button className={`role-card ${role === 'keyholder' ? 'selected' : ''}`} onClick={() => setRole('keyholder')}>
            <KeyRound size={24} />
            <strong>I hold the key</strong>
            <span>She sets the rhythm.</span>
          </button>
          <button className={`role-card ${role === 'kept' ? 'selected' : ''}`} onClick={() => setRole('kept')}>
            <LockKeyhole size={24} />
            <strong>I wear the cage</strong>
            <span>He follows the rhythm.</span>
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        <button className="primary-btn" onClick={connect} disabled={!code.trim() || !role || loading}>
          {loading ? 'Connecting…' : 'Continue'} <ArrowRight size={18} />
        </button>
      </section>
    </main>
  )
}

function Setup({ data, update, goDashboard }) {
  const setup = data.setup || {}

  const set = (key, value) => update(d => ({ ...d, setup: { ...(d.setup || {}), [key]: value } }))
  const toggle = (key, value) => update(d => {
    const current = d.setup?.[key] || []
    const next = current.includes(value) ? current.filter(x => x !== value) : [...current, value]
    return { ...d, setup: { ...(d.setup || {}), [key]: next } }
  })

  const finish = async () => {
    const rhythm = RHYTHMS.find(r => r.id === setup.rhythm)
    let returnDate = data.returnDate
    if (rhythm?.days) {
      const dt = new Date()
      dt.setDate(dt.getDate() + rhythm.days)
      returnDate = dt.toISOString()
    }
    await update(d => ({
      ...d,
      setupComplete: true,
      mode: 'distance',
      ruinedGoal: setup.ruinedGoal || 10,
      returnDate,
      setup: { ...(d.setup || {}), completedAt: new Date().toISOString() },
    }))
    goDashboard()
  }

  const canFinish = setup.rhythm && setup.likesRuined && setup.ruinedGoal && (setup.connection || []).length > 0 && setup.teaseStyle

  return (
    <section className="panel setup-panel">
      <p className="eyebrow"><Sparkles size={14} /> Keyholder setup</p>
      <h2>Let’s set the rhythm.</h2>
      <p className="lead">This is not a test. It is simply how you want the two of you to stay connected while he is locked.</p>

      <div className="question-block">
        <h3>How long do you like him locked before a full orgasm is even possible?</h3>
        <p>He may still be unlocked for teasing, ruined orgasms, sex, or play — but a true full orgasm only happens when you decide he has earned it.</p>
        <div className="options-list">
          {RHYTHMS.map(r => <OptionCard key={r.id} active={setup.rhythm === r.id} title={r.label} detail={r.detail} onClick={() => set('rhythm', r.id)} />)}
        </div>
      </div>

      <div className="question-block">
        <h3>Do you enjoy giving him ruined orgasms?</h3>
        <p>A ruined orgasm means he releases without the full satisfaction. He is left wanting more, and usually goes right back in the cage.</p>
        <div className="chip-row">
          {['Yes — I love that', 'I think I would', 'Curious to try', 'I would rather keep things simpler'].map(x => <Chip key={x} active={setup.likesRuined === x} onClick={() => set('likesRuined', x)}>{x}</Chip>)}
        </div>
      </div>

      <div className="question-block">
        <h3>Before he earns a full orgasm, how many ruined orgasms should he collect first?</h3>
        <p>This is not in a row. It is the total number he earns before you decide he gets the real one.</p>
        <div className="options-list">
          {RUINED_GOALS.map(g => <OptionCard key={g.value} active={setup.ruinedGoal === g.value} title={g.label} detail={g.detail} onClick={() => set('ruinedGoal', g.value)} />)}
        </div>
      </div>

      <div className="question-block">
        <h3>What keeps you most connected to him while he is locked?</h3>
        <div className="chip-row">
          {CONNECTION_OPTIONS.map(x => <Chip key={x} active={(setup.connection || []).includes(x)} onClick={() => toggle('connection', x)}>{x}</Chip>)}
        </div>
      </div>

      <div className="question-block">
        <h3>What kind of teasing feels most like you?</h3>
        <div className="chip-row">
          {TEASE_STYLES.map(x => <Chip key={x} active={setup.teaseStyle === x} onClick={() => set('teaseStyle', x)}>{x}</Chip>)}
        </div>
      </div>

      <div className="question-block">
        <h3>When you tease him, what response do you enjoy most?</h3>
        <div className="chip-row">
          {RESPONSE_STYLES.map(x => <Chip key={x} active={setup.responseStyle === x} onClick={() => set('responseStyle', x)}>{x}</Chip>)}
        </div>
      </div>

      <div className="question-block">
        <h3>Things to explore later</h3>
        <p>Only mark what sounds interesting. Nothing here is required.</p>
        <div className="chip-row">
          {['Strap-on over the cage', 'Sleeve sex', 'Prostate play', 'Long teasing sessions', 'Ruined orgasm nights', 'Oral focus on me'].map(x => <Chip key={x} active={(setup.explore || []).includes(x)} onClick={() => toggle('explore', x)}>{x}</Chip>)}
        </div>
      </div>

      <div className="question-block">
        <h3>Anything off-limits or important to know?</h3>
        <textarea className="textarea" value={setup.notes || ''} onChange={(e) => set('notes', e.target.value)} placeholder="Optional. Boundaries, hopes, reminders, or anything you want him to understand." />
      </div>

      <button className="primary-btn wide" onClick={finish} disabled={!canFinish}>Set our rhythm</button>
      {!canFinish && <p className="muted center">Answer the required rhythm questions to continue.</p>}
    </section>
  )
}

function Dashboard({ data, role, update, setScreen }) {
  const setup = data.setup || {}
  const rhythm = RHYTHMS.find(r => r.id === setup.rhythm)
  const day = todayIndex()
  const herIdeaPool = DISTANCE_IDEAS[setup.teaseStyle] || DISTANCE_IDEAS['Still figuring it out']
  const herIdea = herIdeaPool[day % herIdeaPool.length]
  const himIdea = HIM_IDEAS[day % HIM_IDEAS.length]
  const lockedDays = data.startDate ? Math.max(0, daysBetween(data.startDate, new Date())) : 0
  const daysToReturn = data.returnDate ? Math.max(0, daysBetween(new Date(), data.returnDate)) : null

  const logDistance = (text) => update(d => ({ ...d, distanceActions: [{ id: uid(), text, role, at: new Date().toISOString() }, ...(d.distanceActions || [])].slice(0, 20) }))
  const addRuined = () => update(d => ({ ...d, ruinedCount: (d.ruinedCount || 0) + 1, reunionActions: [{ id: uid(), text: 'Ruined orgasm logged', at: new Date().toISOString() }, ...(d.reunionActions || [])] }))
  const markReunion = (item) => update(d => ({ ...d, reunionActions: [{ id: uid(), text: item.text, cat: item.cat, at: new Date().toISOString(), counts: item.counts }, ...(d.reunionActions || [])].slice(0, 20), ruinedCount: item.counts ? (d.ruinedCount || 0) + 1 : (d.ruinedCount || 0) }))
  const resetRuined = () => update(d => ({ ...d, ruinedCount: 0 }))

  if (!data.setupComplete && role === 'kept') {
    return (
      <section className="panel waiting-panel">
        <LockKeyhole size={42} />
        <h2>She sets the rhythm first.</h2>
        <p>Once she answers the setup questions, this space will open for both of you. That is part of the point.</p>
        <button className="ghost-btn big" onClick={() => setScreen('notes')}><MessageCircle size={18} /> Leave a note</button>
      </section>
    )
  }

  return (
    <div className="dashboard-grid">
      <section className="hero-panel">
        <p className="eyebrow"><ShieldCheck size={14} /> Current rhythm</p>
        <h2>{setup.teaseStyle || 'Private, playful, and yours'}</h2>
        <p>{rhythm?.detail || 'She decides when the timing feels right.'}</p>
        <div className="stats-grid">
          <div><strong>{lockedDays}</strong><span>days in this</span></div>
          <div><strong>{daysToReturn === null ? '—' : daysToReturn}</strong><span>{daysToReturn === 1 ? 'day to return' : 'days to return'}</span></div>
          <div><strong>{data.ruinedCount || 0}/{data.ruinedGoal || 10}</strong><span>ruined before full</span></div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow"><Clock size={14} /> Distance mode</p>
        <h3>Today’s suggestion for {role === 'keyholder' ? 'her' : 'him'}</h3>
        <p className="daily-idea">{role === 'keyholder' ? herIdea : himIdea}</p>
        <button className="secondary-btn" onClick={() => logDistance(role === 'keyholder' ? herIdea : himIdea)}><Check size={16} /> Mark done</button>
      </section>

      <section className="panel">
        <p className="eyebrow"><Flame size={14} /> Reunion mode</p>
        <h3>When you are together</h3>
        <p>Use this as the menu. The goal is regular intimacy without making full release automatic.</p>
        <div className="reunion-list">
          {REUNION_MENU.map(item => (
            <button key={item.id} onClick={() => markReunion(item)}>
              <strong>{item.cat}</strong>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
        <div className="counter-row">
          <button className="secondary-btn" onClick={addRuined}><Plus size={16} /> Add ruined</button>
          <button className="ghost-btn" onClick={resetRuined}>Reset</button>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow"><KeyRound size={14} /> What she chose</p>
        <div className="summary-list">
          <p><strong>Ruined orgasms:</strong> {setup.likesRuined}</p>
          <p><strong>Before full release:</strong> {data.ruinedGoal || setup.ruinedGoal || 10} total</p>
          <p><strong>Connection:</strong> {(setup.connection || []).join(', ') || 'Not set'}</p>
          <p><strong>His response:</strong> {setup.responseStyle || 'Not set'}</p>
          <p><strong>Explore later:</strong> {(setup.explore || []).join(', ') || 'Keep it simple for now'}</p>
          {setup.notes && <p><strong>Her note:</strong> {setup.notes}</p>}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow"><MessageCircle size={14} /> Notes</p>
        <h3>Keep the thread warm.</h3>
        <p>{data.notes?.length ? `Latest: “${data.notes[0].text}”` : 'No notes yet.'}</p>
        <button className="secondary-btn" onClick={() => setScreen('notes')}><MessageCircle size={16} /> Open notes</button>
      </section>
    </div>
  )
}

function Notes({ data, role, update, setScreen }) {
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return
    update(d => ({ ...d, notes: [{ id: uid(), text: text.trim(), from: role === 'keyholder' ? 'Her' : 'Him', at: new Date().toISOString() }, ...(d.notes || [])].slice(0, 50) }))
    setText('')
  }
  return (
    <section className="panel notes-panel">
      <button className="ghost-btn" onClick={() => setScreen('dashboard')}>Back</button>
      <h2>Private notes</h2>
      <div className="note-composer">
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a little something…" />
        <button className="primary-btn" onClick={send}><Send size={16} /> Send</button>
      </div>
      <div className="notes-list">
        {(data.notes || []).map(n => <article key={n.id} className="note"><p>{n.text}</p><small>{n.from} · {fmtTime(n.at)}</small></article>)}
      </div>
    </section>
  )
}
