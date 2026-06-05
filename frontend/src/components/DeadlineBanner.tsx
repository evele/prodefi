import { useState, useEffect } from 'react'

function countdownFontSize(remaining: number): number {
  const days = remaining / 86400
  if (days >= 7) return 14
  if (days <= 1) return 22
  return Math.round(14 + ((7 - days) / 6) * 8)
}

function formatCountdown(secs: number): string {
  const s = Math.max(0, secs)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m ${pad(ss)}s`
  return `${pad(h)}h ${pad(m)}m ${pad(ss)}s`
}

export function DeadlineBanner({ deadline }: { deadline: bigint | undefined }) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  if (!deadline || deadline === 0n) return null

  const deadlineNum = Number(deadline)
  const isExpired = now >= deadlineNum
  const remaining = Math.max(0, deadlineNum - now)

  return (
    <div
      className="rounded-lg px-4 py-2.5 text-sm"
      style={{
        background: isExpired ? 'rgba(255,77,109,0.1)' : 'rgba(255,214,0,0.08)',
        border: `1px solid ${isExpired ? 'rgba(255,77,109,0.25)' : 'rgba(255,214,0,0.2)'}`,
        color: isExpired ? 'var(--accent-red)' : 'var(--accent-gold)',
      }}
    >
      <div
        className="w-fit whitespace-nowrap"
        style={{ animation: isExpired ? undefined : 'marquee-bounce 5s ease-in-out infinite alternate' }}
      >
        {isExpired ? (
          <span className="font-semibold">🔒 Predicciones cerradas · {new Date(deadlineNum * 1000).toLocaleDateString()}</span>
        ) : (
          <>⏱ Cierra en <span style={{ fontFamily: 'var(--font-mono-custom)', fontWeight: 600, fontSize: `${countdownFontSize(remaining)}px` }}>{formatCountdown(remaining)}</span></>
        )}
      </div>
    </div>
  )
}
