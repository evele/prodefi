/* global React */
const { useState, useEffect, useRef } = React;

// ---------- Shared atoms ----------

function Logo({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="display" style={{ fontSize: size, letterSpacing: '0.02em', color: 'var(--bone)' }}>
        PRODEFI
      </span>
      <span aria-hidden style={{
        width: size * 0.85, height: size * 0.85, borderRadius: '50%',
        background: 'var(--bone)', color: 'var(--ink)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.55, fontWeight: 800, fontFamily: 'Archivo'
      }}>
        ⚽
      </span>
    </div>
  );
}

function Btn({ kind = 'primary', children, onClick, full, as = 'button', href, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '16px 22px', borderRadius: 999, border: '1px solid transparent',
    fontFamily: 'Archivo', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em',
    cursor: 'pointer', textDecoration: 'none', width: full ? '100%' : 'auto',
    transition: 'transform 120ms ease, background 160ms ease, border-color 160ms ease',
    textTransform: 'uppercase',
  };
  const variants = {
    primary: { background: 'var(--bone)', color: 'var(--ink)' },
    ghost:   { background: 'transparent', color: 'var(--bone)', border: '1px solid var(--line-2)' },
    lima:    { background: 'var(--lima)', color: 'var(--ink)' },
    celeste: { background: 'var(--celeste)', color: 'var(--ink)' },
  };
  const Tag = as;
  return (
    <Tag href={href} onClick={onClick} style={{ ...base, ...variants[kind], ...style }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
    </Tag>
  );
}

// AFA-inspired triple-stripe: celeste / bone / celeste
function StripeBar({ height = 6 }) {
  return (
    <div aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
      <div style={{ height, background: 'var(--celeste)' }} />
      <div style={{ height, background: 'var(--bone)' }} />
      <div style={{ height, background: 'var(--celeste)' }} />
    </div>
  );
}

// Editorial duotone placeholder (no SVG art, just tinted/striped block with a label)
function HeroImage({ label = '[IMAGEN_HERO]', tall, hue = 210 }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: tall ? '3 / 4' : '4 / 5',
      borderRadius: 4,
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse at 30% 20%, oklch(0.62 0.10 ${hue} / 0.85), transparent 60%),
        radial-gradient(ellipse at 80% 80%, oklch(0.30 0.08 ${hue}), transparent 70%),
        linear-gradient(180deg, oklch(0.55 0.09 ${hue}) 0%, oklch(0.20 0.05 ${hue}) 100%)
      `,
      border: '1px solid var(--line)',
      isolation: 'isolate',
    }}>
      {/* horizontal "stadium" stripes */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(180deg, transparent 0 22px, rgba(255,255,255,0.04) 22px 23px)',
        mixBlendMode: 'overlay',
      }} />
      {/* duotone overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(7,9,15,0.35) 60%, rgba(7,9,15,0.85) 100%)',
      }} />
      {/* grain */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '3px 3px', mixBlendMode: 'overlay', opacity: 0.6,
      }} />
      {/* label */}
      <div style={{
        position: 'absolute', top: 14, left: 14, right: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.16em',
        color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
      }}>
        <span>● {label}</span>
        <span>EDITABLE</span>
      </div>
      {/* corner caption */}
      <div style={{
        position: 'absolute', bottom: 18, left: 18, right: 18,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <span className="eyebrow" style={{ color: 'var(--celeste-2)' }}>Mundial · 2026</span>
        <span className="display" style={{ fontSize: 28, color: 'var(--bone)' }}>
          Vamos,<br />Argentina.
        </span>
      </div>
      {/* tiny crosshair */}
      <div aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%', width: 1, height: 28,
        background: 'rgba(255,255,255,0.25)', transform: 'translate(-50%,-50%)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%', width: 28, height: 1,
        background: 'rgba(255,255,255,0.25)', transform: 'translate(-50%,-50%)',
      }} />
    </div>
  );
}

// ---------- HEADER ----------
function Header({ isMobile }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '14px 18px' : '18px 32px',
      }}>
        <Logo size={isMobile ? 18 : 22} />
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 28, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
            <a href="#countdown" style={{ textDecoration: 'none' }}>Mundial</a>
            <a href="#premios" style={{ textDecoration: 'none' }}>Premios</a>
            <a href="#waitlist" style={{ textDecoration: 'none' }}>Waitlist</a>
            <a href="#faq" style={{ textDecoration: 'none' }}>FAQ</a>
          </nav>
        )}
        <a href="#waitlist" style={{
          fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--lima)',
          padding: '8px 14px', borderRadius: 999, textDecoration: 'none', fontWeight: 700,
        }}>
          Sumarme
        </a>
      </div>
    </header>
  );
}

// ---------- HERO ----------
function Hero({ isMobile, onWaitlist, onApp }) {
  return (
    <section style={{ position: 'relative', background: 'var(--ink)' }}>
      {/* subtle radial */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(116,172,223,0.18) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        padding: isMobile ? '36px 22px 28px' : '64px 56px 40px',
        maxWidth: 1280, margin: '0 auto',
      }}>
        {/* eyebrow line */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: isMobile ? 28 : 40,
        }}>
          <span style={{ width: 28, height: 1, background: 'var(--celeste)' }} />
          <span className="eyebrow celeste">Predicciones del Mundial · Onchain</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr',
          gap: isMobile ? 28 : 56,
          alignItems: 'end',
        }}>
          {/* TITLE column */}
          <div>
            <h1 className="display" style={{
              fontSize: isMobile ? 'clamp(64px, 18vw, 92px)' : 'clamp(96px, 9vw, 156px)',
              margin: 0,
              color: 'var(--bone)',
            }}>
              Jugá<br />
              al <span className="editorial" style={{ color: 'var(--celeste)', textTransform: 'none', fontStyle: 'italic', fontWeight: 400 }}>Mundial</span><br />
              <span style={{ color: 'var(--bone)' }}>como nunca.</span>
            </h1>

            <p style={{
              marginTop: isMobile ? 22 : 32,
              maxWidth: 540,
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.5,
              color: 'var(--bone-2)',
            }}>
              Conseguí tu cartón, predecí los partidos del Mundial 2026 y competí
              contra miles de hinchas por <strong style={{ color: 'var(--bone)', fontWeight: 700 }}>premios reales</strong>.
              Una sola pasión, un solo ranking.
            </p>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 12,
              marginTop: isMobile ? 26 : 36,
            }}>
              <Btn kind="lima" onClick={onWaitlist}>
                Sumate a la waiting list →
              </Btn>
              <Btn kind="ghost" onClick={onApp}>
                Ir a la app
              </Btn>
            </div>

            {/* trust line */}
            <div style={{
              marginTop: isMobile ? 22 : 28,
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'JetBrains Mono', fontSize: 11,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--lima)', boxShadow: '0 0 0 4px rgba(200,255,61,0.15)',
              }} />
              <span>Resultados verificables · Sin saber de crypto</span>
            </div>
          </div>

          {/* IMAGE column */}
          {!isMobile && (
            <div style={{ position: 'relative' }}>
              <HeroImage tall hue={215} />
              {/* sticker */}
              <div style={{
                position: 'absolute', top: -18, right: -18,
                background: 'var(--lima)', color: 'var(--ink)',
                padding: '14px 18px', borderRadius: 999,
                fontFamily: 'Anton', textTransform: 'uppercase',
                fontSize: 18, letterSpacing: '0.02em',
                transform: 'rotate(6deg)',
                boxShadow: '0 8px 20px rgba(200,255,61,0.25)',
              }}>
                Beta abierta
              </div>
            </div>
          )}
        </div>

        {/* mobile image below */}
        {isMobile && (
          <div style={{ marginTop: 28, position: 'relative' }}>
            <HeroImage hue={215} />
            <div style={{
              position: 'absolute', top: -14, right: 8,
              background: 'var(--lima)', color: 'var(--ink)',
              padding: '10px 14px', borderRadius: 999,
              fontFamily: 'Anton', textTransform: 'uppercase',
              fontSize: 13, letterSpacing: '0.02em',
              transform: 'rotate(6deg)',
            }}>
              Beta abierta
            </div>
          </div>
        )}
      </div>

      {/* AFA stripe */}
      <StripeBar height={isMobile ? 4 : 6} />

      {/* 3-step strip */}
      <div style={{
        background: 'var(--ink-2)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: isMobile ? '24px 22px' : '32px 56px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 18 : 0,
        }}>
          {[
            { n: '01', t: 'Conseguí tu cartón', d: 'Un cartón = una entrada al ranking del Mundial.' },
            { n: '02', t: 'Hacé tus predicciones', d: 'Resultados, ganadores, sorpresas. Vos decidís.' },
            { n: '03', t: 'Competí por premios', d: 'Cada acierto suma puntos. El ranking define todo.' },
          ].map((s, i) => (
            <div key={s.n} style={{
              padding: isMobile ? '0' : '0 28px',
              borderLeft: !isMobile && i > 0 ? '1px solid var(--line)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.18em',
                color: 'var(--celeste)',
              }}>
                PASO {s.n}
              </div>
              <div className="display" style={{ fontSize: 22, color: 'var(--bone)' }}>{s.t}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Logo = Logo;
window.Btn = Btn;
window.StripeBar = StripeBar;
window.HeroImage = HeroImage;
window.Header = Header;
window.Hero = Hero;
