import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const W3F_KEY = '080307e5-0079-4ded-b1fc-9a111fa9ceda'


/* ── Question definitions ───────────────────────────────────────────────
   Qualifiers run first so unqualified traffic self-selects out before we
   ask for contact details. Contact fields are last, which also means the
   partial-lead beacon still captures the qualifying answers on abandon. */
const STEPS = [
  {
    name: 'Website',
    type: 'text',
    inputType: 'url',
    q: 'What’s your website?',
    placeholder: 'yourbrand.com',
  },
  {
    name: 'Business Type',
    type: 'choice',
    q: 'What kind of business are you running?',
    options: [
      'E-commerce',
      'Local business',
      'Info product / coaching',
      'Other',
    ],
  },
  {
    name: 'Monthly Revenue',
    type: 'choice',
    q: 'What’s your current monthly revenue?',
    options: [
      'Under $10k a month',
      '$10k to $30k a month',
      '$30k to $50k a month',
      '$50k to $100k a month',
      '$100k to $150k a month',
      '$150k a month+',
    ],
  },
  {
    name: 'Ad Spend',
    type: 'choice',
    q: 'What’s your current monthly ad spend?',
    options: [
      '$0',
      '$1k to $5k a month',
      '$5k to $10k a month',
      '$10k to $30k a month',
      '$30k to $50k a month',
      '$50k a month+',
    ],
  },
  { name: 'Name',  type: 'text', inputType: 'text',  q: 'What’s your name?',        placeholder: 'First and last' },
  { name: 'Email', type: 'text', inputType: 'email', q: 'Best email to reach you?',      placeholder: 'you@business.com' },
  { name: 'Phone', type: 'text', inputType: 'tel',   q: 'And your phone number?',        placeholder: '(000) 000-0000' },
]

const TOTAL = STEPS.length

/* ── Context ──────────────────────────────────────────────────────────── */
const ApplyContext = createContext({ openApply: () => {} })
export const useApply = () => useContext(ApplyContext)

export function ApplyProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openApply = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault()
    setOpen(true)
  }, [])
  return (
    <ApplyContext.Provider value={{ openApply }}>
      {children}
      {open && <ApplyModal onClose={() => setOpen(false)} />}
    </ApplyContext.Provider>
  )
}

/* ── Modal ────────────────────────────────────────────────────────────── */
function ApplyModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('form') // form | sending | done
  const [selected, setSelected] = useState(null)

  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const completed = useRef(false)
  const lastPartial = useRef('')
  const answersRef = useRef(answers)
  const stepRef = useRef(step)
  answersRef.current = answers
  stepRef.current = step

  const current = STEPS[step]

  /* Lock the page behind the modal. Lenis runs its own rAF loop and will
     keep scrolling the body under the overlay unless it is explicitly
     stopped, so stopping it is not optional here. */
  useEffect(() => {
    const lenis = window.__lenis
    const prevOverflow = document.body.style.overflow
    if (lenis) lenis.stop()
    document.body.style.overflow = 'hidden'
    return () => {
      if (lenis) lenis.start()
      document.body.style.overflow = prevOverflow
    }
  }, [])

  /* Esc closes, Tab stays inside the panel */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const f = panelRef.current.querySelectorAll(
        'button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      )
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  /* Focus the field each time the step changes */
  useEffect(() => {
    if (phase !== 'form') return
    const t = setTimeout(() => { if (inputRef.current) inputRef.current.focus() }, 60)
    return () => clearTimeout(t)
  }, [step, phase])

  /* Keep the selected-choice highlight in sync when stepping back */
  useEffect(() => {
    setSelected(answersRef.current[STEPS[step].name] ?? null)
  }, [step])

  /* ── Partial lead capture ──
     Same contract as the standalone landing page: fire only if something
     was typed, never twice for identical data, never after a real submit. */
  useEffect(() => {
    const sendPartial = () => {
      if (completed.current) return
      const data = {}
      STEPS.forEach(s => {
        const v = answersRef.current[s.name]
        if (v && String(v).trim()) data[s.name] = String(v).trim()
      })
      const keys = Object.keys(data)
      if (!keys.length) return
      const snap = JSON.stringify(data)
      if (snap === lastPartial.current) return
      lastPartial.current = snap

      const fd = new FormData()
      fd.append('access_key', W3F_KEY)
      fd.append('from_name', 'BlackWater Website Application')
      fd.append('subject', '⚠️ PARTIAL APPLICATION — not finished')
      fd.append('Status', 'PARTIAL — left at step ' + (stepRef.current + 1) + ' of ' + TOTAL)
      keys.forEach(k => fd.append(k, data[k]))
      if (data.Email) fd.append('replyto', data.Email)
      try { navigator.sendBeacon('https://api.web3forms.com/submit', fd) } catch (err) { /* best effort */ }
    }
    const onVis = () => { if (document.visibilityState === 'hidden') sendPartial() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', sendPartial)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', sendPartial)
      sendPartial() // closing the modal counts as abandoning it
    }
  }, [])

  const validate = () => {
    const v = (answers[current.name] || '').trim()
    if (!v) { setError('Please fill this in.'); return false }
    if (current.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError('That email doesn’t look right.'); return false
    }
    if (current.inputType === 'tel' && v.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number.'); return false
    }
    if (current.inputType === 'url' && !/\./.test(v)) {
      setError('Paste your full website link.'); return false
    }
    setError('')
    return true
  }

  const next = () => {
    if (!validate()) return
    if (step < TOTAL - 1) setStep(step + 1)
    else submit()
  }

  const pick = (val) => {
    setSelected(val)
    setAnswers(a => ({ ...a, [current.name]: val }))
    setError('')
    setTimeout(() => {
      if (step < TOTAL - 1) setStep(step + 1)
      else submit()
    }, 220)
  }

  const submit = async () => {
    completed.current = true
    setPhase('sending')
    const fd = new FormData()
    fd.append('access_key', W3F_KEY)
    fd.append('from_name', 'BlackWater Website Application')
    fd.append('subject', 'New BlackWater application — website')
    STEPS.forEach(s => fd.append(s.name, answersRef.current[s.name] || ''))
    if (answersRef.current.Email) fd.append('replyto', answersRef.current.Email)
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { Accept: 'application/json' }, body: fd,
      })
      const json = await r.json()
      if (!json.success) throw new Error('rejected')
      if (window.fbq) window.fbq('track', 'Lead')
      setPhase('done')
    } catch (err) {
      completed.current = false
      setPhase('form')
      setError('Something went wrong. Try again, or email jack@blackwatermrkting.com.')
    }
  }

  const pct = phase === 'done' ? 100 : (step / TOTAL) * 100

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Apply to work with BlackWater"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8,8,8,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', overflowY: 'auto',
      }}
    >
      <style>{`
        @keyframes bwa-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .bwa-step{animation:bwa-fade .35s cubic-bezier(.4,0,.2,1)}
        .bwa-input{width:100%;font-family:inherit;font-size:20px;color:#080808;background:transparent;
          border:none;border-bottom:2px solid rgba(8,8,8,.14);padding:10px 2px;
          transition:border-color .2s cubic-bezier(.4,0,.2,1)}
        .bwa-input::placeholder{color:rgba(8,8,8,.28)}
        .bwa-input:focus{outline:none;border-color:#C8D746}
        .bwa-choice{width:100%;text-align:left;font-family:inherit;font-size:17px;font-weight:500;
          color:#080808;background:#fff;border:1.5px solid rgba(8,8,8,.14);border-radius:14px;
          padding:16px 18px;cursor:pointer;
          transition:border-color .15s cubic-bezier(.4,0,.2,1),background .15s cubic-bezier(.4,0,.2,1),transform .12s cubic-bezier(.4,0,.2,1)}
        .bwa-choice:hover{border-color:#080808}
        .bwa-choice:active{transform:scale(.99)}
        .bwa-choice.sel{border-color:#C8D746;background:rgba(200,215,70,.14)}
        .bwa-next{font-family:inherit;font-size:16px;font-weight:700;letter-spacing:.02em;
          text-transform:uppercase;color:#fff;background:#080808;border:none;border-radius:12px;
          padding:15px 30px;cursor:pointer;transition:transform .12s cubic-bezier(.4,0,.2,1)}
        .bwa-next:active{transform:scale(.97)}
        .bwa-back{background:none;border:none;font-family:inherit;font-size:14px;color:#6b6b6b;
          cursor:pointer;padding:6px 0;display:inline-flex;align-items:center;gap:5px}
        .bwa-back:hover{color:#080808}
        .bwa-x{position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;
          font-size:26px;line-height:1;color:#6b6b6b;padding:4px 8px}
        .bwa-x:hover{color:#080808}
        @media (prefers-reduced-motion:reduce){
          .bwa-step{animation:none}
          .bwa-bar-fill{transition:none}
        }
      `}</style>

      <div
        ref={panelRef}
        style={{
          position: 'relative', width: '100%', maxWidth: '560px',
          background: '#ffffff', borderRadius: '18px',
          padding: 'clamp(28px,6vw,40px) clamp(22px,5vw,34px)',
          fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#080808',
          boxShadow: '0 24px 80px rgba(0,0,0,.35)', margin: 'auto',
        }}
      >
        <button className="bwa-x" onClick={onClose} aria-label="Close">&times;</button>

        {/* progress */}
        <div style={{ height: '3px', background: 'rgba(8,8,8,.08)', borderRadius: '100px', overflow: 'hidden', marginBottom: '20px' }}>
          <div className="bwa-bar-fill" style={{ height: '100%', width: pct + '%', background: '#C8D746', borderRadius: '100px', transition: 'width .4s cubic-bezier(.4,0,.2,1)' }} />
        </div>

        {phase === 'sending' && (
          <p style={{ fontSize: '16px', color: '#6b6b6b', margin: '2rem 0' }}>Sending&hellip;</p>
        )}

        {phase === 'form' && (
          <div className="bwa-step" key={step}>
            <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '14px' }}>
              <b style={{ color: '#a9bb1e' }}>{String(step + 1).padStart(2, '0')}</b> / {String(TOTAL).padStart(2, '0')}
            </div>

            {step > 0 && (
              <button className="bwa-back" onClick={() => { setError(''); setStep(step - 1) }}>&larr; Back</button>
            )}

            <h2 style={{ fontSize: 'clamp(24px,6.5vw,32px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-.015em', margin: '6px 0 22px' }}>
              {current.q}
            </h2>

            {current.type === 'text' ? (
              <>
                <input
                  ref={inputRef}
                  className="bwa-input"
                  type={current.inputType}
                  inputMode={current.inputType === 'tel' ? 'tel' : undefined}
                  placeholder={current.placeholder}
                  value={answers[current.name] || ''}
                  onChange={e => { setAnswers(a => ({ ...a, [current.name]: e.target.value })); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); next() } }}
                />
                <div style={{ marginTop: '26px' }}>
                  <button className="bwa-next" onClick={next}>
                    {step === TOTAL - 1 ? 'Submit application' : 'Next'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {current.options.map(opt => (
                  <button
                    key={opt}
                    ref={opt === current.options[0] ? inputRef : null}
                    className={'bwa-choice' + (selected === opt ? ' sel' : '')}
                    onClick={() => pick(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {error && <p style={{ color: '#c0392b', fontSize: '14px', marginTop: '14px' }}>{error}</p>}
          </div>
        )}

        {phase === 'done' && <ThankYou />}
      </div>
    </div>
  )
}

/* ── Thank-you screen ─────────────────────────────────────────────────── */
function ThankYou() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().catch(() => {}) } else { v.pause() }
  }

  return (
    <div className="bwa-step" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a9bb1e', marginBottom: '12px' }}>
        Application received
      </div>

      <h2 style={{ fontSize: 'clamp(24px,6.5vw,32px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-.015em', marginBottom: '10px' }}>
        Thank you for applying.
      </h2>
      <p style={{ fontSize: '16px', color: '#6b6b6b', margin: '0 auto 30px', maxWidth: '36ch' }}>
        Jack will reach out to you shortly.
      </p>

      {/* Free resources — Jack asked for this to be the big one */}
      <h3 style={{ fontSize: 'clamp(22px,5.5vw,28px)', fontWeight: 700, letterSpacing: '-.01em', marginBottom: '8px' }}>
        Free resources
      </h3>
      <p style={{ fontSize: '15px', color: '#6b6b6b', margin: '0 auto 22px', maxWidth: '40ch' }}>
        Enjoy some free resources while you wait.
      </p>

      {/* VSL slot */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', background: '#0d0d0d', marginBottom: '26px' }}>
        <video
          ref={videoRef}
          src="/vsl.mp4"
          playsInline
          preload="metadata"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play video"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, cursor: 'pointer',
              background: 'rgba(8,8,8,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#C8D746', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="24" viewBox="0 0 22 24" fill="#080808" style={{ marginLeft: '3px' }}><path d="M0 0l22 12L0 24z" /></svg>
            </span>
          </button>
        )}
      </div>

      {/* Case studies / proof */}
      <h3 style={{ fontSize: 'clamp(18px,4.5vw,22px)', fontWeight: 700, letterSpacing: '-.01em', marginBottom: '14px' }}>
        Recent results
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '10px', marginBottom: '18px' }}>
        {PROOF.map(p => (
          <figure key={p.src} style={{ margin: 0 }}>
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              style={{ width: '100%', borderRadius: '10px', display: 'block', border: '1px solid rgba(8,8,8,.1)' }}
            />
            <figcaption style={{ fontSize: '12px', color: '#6b6b6b', marginTop: '6px' }}>{p.alt}</figcaption>
          </figure>
        ))}
      </div>

      <p style={{ fontSize: '13px', color: '#6b6b6b', marginTop: '16px' }}>
        Questions before we talk? Email{' '}
        <a href="mailto:jack@blackwatermrkting.com" style={{ color: '#080808' }}>jack@blackwatermrkting.com</a>
      </p>
    </div>
  )
}

/* Screenshots already shipping on the site's ProofSection. Swap these for
   fresher captures when Jack sends them. */
const PROOF = [
  { src: '/results/result-1.webp', alt: 'Ads Manager dashboard' },
  { src: '/results/result-2.webp', alt: 'Ads Manager dashboard' },
]
