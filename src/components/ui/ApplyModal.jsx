import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react'

/* The apply form itself (questions, phone validation with libphonenumber's
   country metadata) lives in ApplyForm.jsx and loads on its own: on first
   open, or quietly a few seconds after the page settles so opening it is
   still instant. Every page used to download it up front. */
const loadForm = () => import('./ApplyForm')
const ApplyModal = lazy(loadForm)

/* ── Context ──────────────────────────────────────────────────────────── */
const ApplyContext = createContext({ openApply: () => {} })
export const useApply = () => useContext(ApplyContext)

export function ApplyProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openApply = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault()
    setOpen(true)
  }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      const go = () => { loadForm().catch(() => {}) }
      if (window.requestIdleCallback) window.requestIdleCallback(go, { timeout: 3000 })
      else go()
    }, 6000)
    return () => clearTimeout(t)
  }, [])
  return (
    <ApplyContext.Provider value={{ openApply }}>
      {children}
      {open && <Suspense fallback={null}><ApplyModal onClose={() => setOpen(false)} /></Suspense>}
    </ApplyContext.Provider>
  )
}
