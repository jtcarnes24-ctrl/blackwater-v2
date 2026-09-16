/* ── Phone validation, international ────────────────────────────────────
   Single source of truth for BOTH forms. The React site imports this file
   directly; the standalone landing page ships an esbuild bundle of it
   (see scripts/build-phone-bundle.sh), so the rules can never drift apart.

   Backed by libphonenumber-js, which carries Google's per-country number
   metadata. A plain regex cannot do this: every country has its own length
   and prefix rules, and they change. */
import {
  parsePhoneNumberFromString,
  AsYouType,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js/min'

export const DEFAULT_COUNTRY = 'US'

/* Countries the traffic actually comes from sit at the top; the rest are
   alphabetical. Everything is still selectable, nothing is excluded. */
const PINNED = ['US', 'CA', 'GB', 'AU']

let countryCache = null

export function countryOptions() {
  if (countryCache) return countryCache

  let nameOf
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' })
    nameOf = (c) => dn.of(c) || c
  } catch {
    nameOf = (c) => c // ancient browser: fall back to the two-letter code
  }

  const all = getCountries()
    .map((code) => {
      try {
        return { code, dial: '+' + getCountryCallingCode(code), name: nameOf(code) }
      } catch {
        return null // country with no dialling code in the metadata
      }
    })
    .filter(Boolean)

  const pinned = PINNED.map((c) => all.find((x) => x.code === c)).filter(Boolean)
  const rest = all
    .filter((x) => PINNED.indexOf(x.code) === -1)
    .sort((a, b) => a.name.localeCompare(b.name))

  countryCache = pinned.concat(rest)
  return countryCache
}

/* A number typed with a leading + carries its own country, so the picker
   should follow what was typed rather than fight it. */
export function countryFromInput(raw, fallback) {
  const v = String(raw || '').trim()
  if (v.charAt(0) !== '+') return fallback
  const parsed = parsePhoneNumberFromString(v)
  if (!parsed || !parsed.country) return fallback

  /* Several territories share one dialling code: +44 covers the UK, Guernsey,
     Jersey and the Isle of Man, +1 covers the US, Canada and the Caribbean.
     libphonenumber picks one of them, which made the picker jump to "Guernsey"
     the moment a British visitor typed their own mobile. Only move the picker
     when the dialling code itself changed; within a shared code the visitor's
     own choice wins and the E.164 result is identical either way. */
  if (fallback) {
    try {
      if (getCountryCallingCode(fallback) === parsed.countryCallingCode) return fallback
    } catch {
      /* unknown fallback: fall through and use what was parsed */
    }
  }
  /* Within a shared code libphonenumber returns whichever territory matched,
     so a British mobile can come back as Guernsey. For the two codes this
     form actually sees, show the country the visitor meant. The E.164 result
     is the same either way; this only changes what the picker reads. */
  const PRIMARY = { 1: 'US', 44: 'GB' }
  return PRIMARY[parsed.countryCallingCode] || parsed.country
}

/* Formats while the visitor types. A leading + means "international", so
   the country hint is dropped and the library works it out from the digits. */
export function formatPhone(raw, country) {
  const v = String(raw || '')
  if (!v) return ''
  const international = v.trim().charAt(0) === '+'
  const typer = international ? new AsYouType() : new AsYouType(country || DEFAULT_COUNTRY)
  return typer.input(v)
}

/* libphonenumber accepts 555 exchanges because a handful are assignable,
   but no real lead has ever typed one. It is the classic fake-number range
   from film and television, so it stays blocked for US and Canada. */
function isNanpFakeRange(parsed) {
  if (!parsed || parsed.countryCallingCode !== '1') return false
  const national = parsed.nationalNumber || ''
  return national.length === 10 && national.slice(3, 6) === '555'
}

/* Some keyboard mash is structurally legal somewhere in the world: 1234567890
   parses as a real Bedford landline once GB is selected. It is still what a
   visitor types when they do not want to be called, so sequential runs and
   repeated digits are refused everywhere. The cost is a real number that
   happens to be a perfect run, which is close enough to nobody. */
function isObviousJunk(parsed) {
  const n = String((parsed && parsed.nationalNumber) || '')
  if (n.length < 7) return false
  if (/^(\d)\1+$/.test(n)) return true

  /* A run means EVERY step is +1 or every step is -1, counting 9 to 0 as a
     step so 1234567890 is caught. Checking the whole number rather than
     searching for a run inside it matters: a substring search flags real
     numbers that merely happen to contain a climb. */
  let up = true
  let down = true
  for (let i = 1; i < n.length; i++) {
    const a = n.charCodeAt(i - 1) - 48
    const b = n.charCodeAt(i) - 48
    if ((b - a + 10) % 10 !== 1) up = false
    if ((a - b + 10) % 10 !== 1) down = false
    if (!up && !down) return false
  }
  return true
}

/* Returns '' when the number is good, otherwise the message to show. */
export function phoneError(raw, country) {
  const v = String(raw || '').trim()
  if (!v) return 'Please enter your phone number.'
  if (v.replace(/\D/g, '').length < 4) return 'That number is too short.'

  const international = v.charAt(0) === '+'
  const parsed = international
    ? parsePhoneNumberFromString(v)
    : parsePhoneNumberFromString(v, country || DEFAULT_COUNTRY)

  if (!parsed) {
    return international
      ? 'That country code is not one we recognise.'
      : 'That does not look like a real phone number.'
  }
  if (!parsed.isValid()) {
    return 'That is not a real number for the country selected. Check the digits, or pick a different country.'
  }
  if (isNanpFakeRange(parsed) || isObviousJunk(parsed)) {
    return 'That does not look like a real phone number.'
  }
  return ''
}

/* What actually gets sent. Readable and dial-ready: +1 712 328 4410 */
export function phoneForSubmit(raw, country) {
  const v = String(raw || '').trim()
  const parsed = v.charAt(0) === '+'
    ? parsePhoneNumberFromString(v)
    : parsePhoneNumberFromString(v, country || DEFAULT_COUNTRY)
  if (!parsed || !parsed.isValid()) return v
  return parsed.formatInternational()
}
