/* ── Website and Instagram validation ───────────────────────────────────
   The apply form used to accept any string containing a dot, so "a.b" and
   "idk.lol" both passed as a website. These check that what was typed is
   actually resolvable-looking, and normalise it so every application
   arrives as a clickable link rather than whatever the visitor typed. */

/* Longest real TLD is 24 characters (.travelersinsurance). Punycode TLDs
   start xn--, so digits and hyphens are allowed after the first two letters. */
const TLD = /^[a-z]{2}(?:[a-z0-9-]{0,22}[a-z0-9])?$/i
const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i

function parseUrlish(raw) {
  const v = String(raw || '').trim()
  if (!v) return null
  if (/\s/.test(v)) return null              // a URL has no spaces in it
  if (v.includes('@') && !/^https?:\/\//i.test(v)) return null  // an email, not a site

  let u
  try {
    u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null

  const host = u.hostname.replace(/\.$/, '')
  const labels = host.split('.')
  if (labels.length < 2) return null                    // needs a dot: no "localhost"
  if (!labels.every((l) => LABEL.test(l))) return null
  if (!TLD.test(labels[labels.length - 1])) return null // ".b" and ".123" are not TLDs
  if (/^\d+$/.test(labels[labels.length - 1])) return null // bare IP address

  u.hostname = host
  return u
}

export function websiteError(raw) {
  const v = String(raw || '').trim()
  if (!v) return 'Please enter your website.'
  if (v.includes('@') && !/^https?:\/\//i.test(v)) {
    return 'That looks like an email address. Paste your website instead.'
  }
  if (!parseUrlish(v)) return 'That does not look like a real website. Try yourbrand.com'
  return ''
}

export function websiteForSubmit(raw) {
  const u = parseUrlish(raw)
  return u ? u.toString().replace(/\/$/, '') : String(raw || '').trim()
}

/* ── Instagram ────────────────────────────────────────────────────────── */

const IG_HOSTS = ['instagram.com', 'www.instagram.com', 'instagr.am', 'www.instagr.am']
/* Instagram handles: letters, digits, period, underscore, up to 30. */
const IG_HANDLE = /^[a-z0-9._]{1,30}$/i
/* Paths that are posts, reels or site furniture rather than a profile. */
const IG_RESERVED = ['p', 'reel', 'reels', 'tv', 'stories', 'explore', 'accounts', 'direct']

/* Returns the bare handle, or null. Accepts a full URL, a bare handle, or
   an @handle, because people will type all three no matter what the field
   asks for, and rejecting two of them just loses applications. */
export function instagramHandle(raw) {
  let v = String(raw || '').trim()
  if (!v) return null
  if (/\s/.test(v)) return null

  if (/^@/.test(v)) v = v.slice(1)

  if (/instagram\.com|instagr\.am|^https?:\/\//i.test(v)) {
    let u
    try {
      u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    } catch {
      return null
    }
    if (!IG_HOSTS.includes(u.hostname.toLowerCase().replace(/\.$/, ''))) return null
    const parts = u.pathname.split('/').filter(Boolean)
    if (!parts.length) return null
    const handle = parts[0].replace(/^@/, '')
    if (IG_RESERVED.includes(handle.toLowerCase())) return null
    return IG_HANDLE.test(handle) ? handle : null
  }

  return IG_HANDLE.test(v) ? v : null
}

export function instagramError(raw) {
  const v = String(raw || '').trim()
  if (!v) return 'Please enter your Instagram.'
  if (/instagram\.com|instagr\.am/i.test(v) && !instagramHandle(v)) {
    return 'That is an Instagram link, but not to a profile. Paste the profile URL.'
  }
  if (!instagramHandle(v)) {
    return 'That does not look like an Instagram profile. Try instagram.com/yourbrand'
  }
  return ''
}

export function instagramForSubmit(raw) {
  const h = instagramHandle(raw)
  return h ? `https://instagram.com/${h}` : String(raw || '').trim()
}
