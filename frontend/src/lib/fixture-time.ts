export type FixtureLanguage = 'es' | 'en'

type FixtureTimePresentation = {
  locale: string
  timeZone: string
  timeZoneLabel: string
  note: string
}

const FIXTURE_TIME_PRESENTATIONS: Record<FixtureLanguage, FixtureTimePresentation> = {
  es: {
    locale: 'es-AR',
    timeZone: 'America/Argentina/Buenos_Aires',
    timeZoneLabel: 'GMT-3',
    note: 'Los horarios se muestran en hora de Buenos Aires, Argentina (GMT-3).',
  },
  en: {
    locale: 'en-US',
    timeZone: 'America/New_York',
    timeZoneLabel: 'ET',
    note: 'Times are shown in US Eastern Time (ET).',
  },
}

export function getFixtureLanguage(): FixtureLanguage {
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang.toLowerCase()
    if (htmlLang.startsWith('en')) return 'en'
    if (htmlLang.startsWith('es')) return 'es'
  }

  if (typeof navigator !== 'undefined') {
    const browserLanguage = navigator.language.toLowerCase()
    if (browserLanguage.startsWith('en')) return 'en'
  }

  return 'es'
}

export function getFixtureTimePresentation(language = getFixtureLanguage()): FixtureTimePresentation {
  return FIXTURE_TIME_PRESENTATIONS[language]
}

export function formatFixtureKickoffDate(kickoffEt?: string, language = getFixtureLanguage()) {
  if (!kickoffEt) return null

  const presentation = getFixtureTimePresentation(language)
  return new Intl.DateTimeFormat(presentation.locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    timeZone: presentation.timeZone,
  }).format(new Date(kickoffEt))
}

export function formatFixtureKickoffTime(kickoffEt?: string, language = getFixtureLanguage()) {
  if (!kickoffEt) return null

  const presentation = getFixtureTimePresentation(language)
  return new Intl.DateTimeFormat(presentation.locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: presentation.timeZone,
  }).format(new Date(kickoffEt))
}

export function getFixtureKickoffDayKey(kickoffEt?: string, language = getFixtureLanguage()) {
  if (!kickoffEt) return null

  const presentation = getFixtureTimePresentation(language)
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: presentation.timeZone,
  }).formatToParts(new Date(kickoffEt))

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) return null
  return `${year}-${month}-${day}`
}
