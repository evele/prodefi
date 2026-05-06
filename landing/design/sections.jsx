/* global React */
const { useState: useState_s, useEffect: useEffect_s, useRef: useRef_s } = React;

// ---------- COUNTDOWN ----------
function Countdown({ isMobile, target }) {
  const [now, setNow] = useState_s(Date.now());
  useEffect_s(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetMs = new Date(target).getTime();
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const Cell = ({ value, label }) => (
    <div style={{
      flex: 1,
      borderLeft: '1px solid var(--line)',
      padding: isMobile ? '18px 10px' : '32px 18px',
      display: 'flex', flexDirection: 'column', gap: 6,
      alignItems: 'flex-start',
    }}>
      <div className="display" style={{
        fontSize: isMobile ? 'clamp(48px, 16vw, 64px)' : 'clamp(80px, 9vw, 128px)',
        color: 'var(--bone)', fontVariantNumeric: 'tabular-nums',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="eyebrow" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );

  return (
    <section id="countdown" style={{
      background: 'var(--ink)',
      borderBottom: '1px solid var(--line)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* faint backdrop type */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', opacity: 0.04,
      }}>
        <span className="display" style={{
          fontSize: isMobile ? 200 : 480,
          color: 'var(--celeste)', whiteSpace: 'nowrap',
        }}>
          2026
        </span>
      </div>

      <div style={{
        position: 'relative',
        maxWidth: 1280, margin: '0 auto',
        padding: isMobile ? '48px 22px 56px' : '88px 56px 96px',
      }}>
        {/* eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          marginBottom: isMobile ? 22 : 36,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 28, height: 1, background: 'var(--celeste)' }} />
            <span className="eyebrow celeste">Cuenta regresiva</span>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            [FECHA_OBJETIVO] · {new Date(target).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <h2 className="display" style={{
          fontSize: isMobile ? 'clamp(40px, 11vw, 56px)' : 'clamp(72px, 7vw, 112px)',
          margin: 0, color: 'var(--bone)', maxWidth: 900,
        }}>
          Falta poco para <span className="editorial" style={{ color: 'var(--celeste)', textTransform: 'none', fontStyle: 'italic' }}>la fiesta</span>.
        </h2>

        <p style={{
          marginTop: isMobile ? 14 : 22,
          fontSize: isMobile ? 15 : 17, color: 'var(--bone-2)',
          maxWidth: 560, lineHeight: 1.5,
        }}>
          El silbatazo inicial del Mundial 2026 está cada vez más cerca.
          Asegurá tu lugar en ProDefi antes de que arranque la pelota.
        </p>

        {/* the counter */}
        <div style={{
          marginTop: isMobile ? 32 : 56,
          display: 'flex',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          background: 'linear-gradient(180deg, rgba(116,172,223,0.04) 0%, transparent 100%)',
        }}>
          <Cell value={days} label="Días" />
          <Cell value={hours} label="Horas" />
          <Cell value={mins} label="Minutos" />
          <Cell value={secs} label="Segundos" />
        </div>

        {/* tape line */}
        <div style={{
          marginTop: 18,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono', fontSize: 10,
          letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase',
        }}>
          <span>● En vivo</span>
          <span>UTC-3 · Buenos Aires</span>
        </div>
      </div>
    </section>
  );
}

// ---------- PREMIOS ----------
function Premios({ isMobile, onWaitlist }) {
  return (
    <section id="premios" style={{
      background: 'var(--bone)', color: 'var(--ink)',
      position: 'relative',
    }}>
      <StripeBar height={isMobile ? 4 : 6} />

      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: isMobile ? '48px 22px 56px' : '96px 56px 112px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: isMobile ? 22 : 36 }}>
          <span style={{ width: 28, height: 1, background: 'var(--celeste-deep)' }} />
          <span className="eyebrow" style={{ color: 'var(--celeste-deep)' }}>Premios</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 24 : 56,
          alignItems: 'start',
        }}>
          <h2 className="display" style={{
            fontSize: isMobile ? 'clamp(44px, 12vw, 64px)' : 'clamp(72px, 7vw, 120px)',
            margin: 0, color: 'var(--ink)',
          }}>
            El que más sabe<br />
            <span className="editorial" style={{ textTransform: 'none', fontStyle: 'italic', color: 'var(--celeste-deep)' }}>se lleva todo.</span>
          </h2>
          <p style={{
            fontSize: isMobile ? 15 : 18, lineHeight: 1.55,
            color: '#3A4054', margin: 0,
            maxWidth: 480,
          }}>
            Cada predicción suma puntos. Al final del Mundial, los mejores del ranking
            se reparten un pozo real. Sin sorteos, sin trampas: gana el que mejor
            entendió la pelota.
          </p>
        </div>

        {/* prize layout */}
        <div style={{
          marginTop: isMobile ? 32 : 64,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr 0.8fr',
          gap: 1,
          background: 'rgba(7,9,15,0.12)',
          border: '1px solid rgba(7,9,15,0.12)',
        }}>
          {/* big card */}
          <div style={{
            background: 'var(--ink)', color: 'var(--bone)',
            padding: isMobile ? '28px 22px' : '40px 36px',
            display: 'flex', flexDirection: 'column',
            minHeight: isMobile ? 280 : 380,
            position: 'relative', overflow: 'hidden',
          }}>
            <span className="eyebrow lima">1° Puesto</span>
            <div className="display" style={{
              fontSize: isMobile ? 'clamp(44px, 13vw, 64px)' : 'clamp(64px, 6vw, 96px)',
              marginTop: 18, color: 'var(--bone)',
              lineHeight: 0.95,
            }}>
              [PREMIO_<br />PRINCIPAL]
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 32 }}>
              <div className="mono" style={{
                fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>
                Pozo principal · Acumulado del Mundial
              </div>
            </div>
            <div aria-hidden style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200, borderRadius: '50%',
              background: 'var(--lima)', opacity: 0.15, filter: 'blur(40px)',
            }} />
          </div>

          {/* mid card */}
          <div style={{
            background: 'var(--celeste)', color: 'var(--ink)',
            padding: isMobile ? '24px 22px' : '32px 28px',
            display: 'flex', flexDirection: 'column', gap: 14,
            minHeight: isMobile ? 200 : 380,
          }}>
            <span className="eyebrow" style={{ color: 'var(--ink)' }}>Top ranking</span>
            <div className="display" style={{
              fontSize: isMobile ? 40 : 'clamp(40px, 4vw, 64px)',
              color: 'var(--ink)', lineHeight: 1,
            }}>
              [CANTIDAD_<br />GANADORES]
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: '#0E2238', margin: 0 }}>
              Premios escalonados para los primeros del ranking general. Más alto
              jugás, más te llevás.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'JetBrains Mono', fontSize: 12,
                  borderBottom: '1px dashed rgba(7,9,15,0.25)', paddingBottom: 4,
                }}>
                  <span>#{String(n).padStart(2, '0')}</span>
                  <span>—</span>
                </div>
              ))}
            </div>
          </div>

          {/* small card */}
          <div style={{
            background: 'var(--bone)', color: 'var(--ink)',
            padding: isMobile ? '24px 22px' : '32px 28px',
            display: 'flex', flexDirection: 'column', gap: 14,
            minHeight: isMobile ? 200 : 380,
            border: '1px solid rgba(7,9,15,0.12)',
          }}>
            <span className="eyebrow" style={{ color: 'var(--celeste-deep)' }}>Detalle</span>
            <div className="display" style={{
              fontSize: isMobile ? 28 : 'clamp(28px, 2.6vw, 40px)',
              lineHeight: 1.05, color: 'var(--ink)',
            }}>
              [DETALLE_<br />PREMIOS]
            </div>
            <p style={{ fontSize: 13, color: '#3A4054', lineHeight: 1.5, margin: 0 }}>
              Tabla completa, fechas de pago y reglas del torneo se publican junto al
              lanzamiento.
            </p>
            <div style={{ marginTop: 'auto' }}>
              <Btn kind="ghost" onClick={onWaitlist} style={{
                color: 'var(--ink)', borderColor: 'rgba(7,9,15,0.25)',
              }}>
                Avisame cuando salga
              </Btn>
            </div>
          </div>
        </div>

        {/* trust strip */}
        <div style={{
          marginTop: isMobile ? 28 : 40,
          display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 32,
          alignItems: 'center',
          fontFamily: 'JetBrains Mono', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#3A4054',
        }}>
          <span>● Ranking transparente</span>
          <span>● Premios verificables</span>
          <span>● Sin letra chica</span>
        </div>
      </div>

      <StripeBar height={isMobile ? 4 : 6} />
    </section>
  );
}

// ---------- WAITLIST ----------
function Waitlist({ isMobile }) {
  const [email, setEmail] = useState_s('');
  const [state, setState] = useState_s('idle'); // idle | sending | done | error
  const [error, setError] = useState_s('');

  const submit = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) { setError('Mirá, ese mail no anda. Probá de nuevo.'); setState('error'); return; }
    setError('');
    setState('sending');
    // simulate POST to [LINK_WAITLIST]
    setTimeout(() => setState('done'), 900);
  };

  return (
    <section id="waitlist" style={{
      background: 'var(--ink)', color: 'var(--bone)',
      borderBottom: '1px solid var(--line)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* faint pitch lines */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(90deg, transparent 0 80px, rgba(116,172,223,0.04) 80px 81px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative',
        maxWidth: 980, margin: '0 auto',
        padding: isMobile ? '56px 22px 64px' : '112px 56px 128px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', marginBottom: isMobile ? 22 : 32 }}>
          <span style={{ width: 28, height: 1, background: 'var(--lima)' }} />
          <span className="eyebrow lima">Waiting list</span>
          <span style={{ width: 28, height: 1, background: 'var(--lima)' }} />
        </div>

        <h2 className="display" style={{
          fontSize: isMobile ? 'clamp(48px, 13vw, 68px)' : 'clamp(80px, 8vw, 132px)',
          margin: 0, color: 'var(--bone)',
        }}>
          Que no te lo<br />
          <span className="editorial" style={{ color: 'var(--celeste)', textTransform: 'none', fontStyle: 'italic' }}>cuente otro.</span>
        </h2>

        <p style={{
          marginTop: isMobile ? 16 : 24,
          fontSize: isMobile ? 15 : 17, color: 'var(--bone-2)',
          maxWidth: 520, margin: '20px auto 0', lineHeight: 1.5,
        }}>
          Dejanos tu mail y te avisamos apenas abramos los cartones.
          Cero spam, cero vueltas.
        </p>

        {state !== 'done' ? (
          <form onSubmit={submit} style={{
            marginTop: isMobile ? 28 : 40,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 10,
            maxWidth: 540, margin: `${isMobile ? 28 : 40}px auto 0`,
          }}>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--line-2)',
                borderRadius: 999,
                padding: '16px 22px',
                color: 'var(--bone)',
                fontFamily: 'Archivo', fontSize: 15,
                outline: 'none',
                transition: 'border-color 160ms ease, background 160ms ease',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--celeste)'; e.target.style.background = 'rgba(116,172,223,0.06)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--line-2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            />
            <Btn kind="lima" as="button" style={{ minWidth: isMobile ? 0 : 200 }}>
              {state === 'sending' ? 'Enviando…' : 'Sumarme →'}
            </Btn>
          </form>
        ) : (
          <div style={{
            marginTop: isMobile ? 28 : 40,
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '20px 28px',
            border: '1px solid var(--lima)',
            borderRadius: 999,
            background: 'rgba(200,255,61,0.08)',
            fontFamily: 'JetBrains Mono', fontSize: 13,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--lima)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: 'var(--lima)',
              boxShadow: '0 0 0 6px rgba(200,255,61,0.15)',
            }} />
            <span>[MENSAJE_CONFIRMACION] · Estás adentro.</span>
          </div>
        )}

        {state === 'error' && (
          <div style={{
            marginTop: 14, fontFamily: 'JetBrains Mono', fontSize: 12,
            color: '#FF8C8C', letterSpacing: '0.06em',
          }}>
            {error}
          </div>
        )}

        <div style={{
          marginTop: isMobile ? 28 : 40,
          display: 'flex', justifyContent: 'center', gap: isMobile ? 16 : 32,
          flexWrap: 'wrap',
          fontFamily: 'JetBrains Mono', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          <span>+12.430 ya anotados</span>
          <span>·</span>
          <span>Endpoint: [LINK_WAITLIST]</span>
        </div>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
function FAQ({ isMobile }) {
  const items = [
    { q: '¿Qué es ProDefi?', a: 'Una plataforma para predecir los partidos del Mundial 2026. Conseguís un cartón, marcás resultados y competís contra el resto de los jugadores en un único ranking global.' },
    { q: '¿Cómo funciona?', a: 'Conseguí tu cartón, completá tus predicciones antes de cada deadline y mirá cómo subís en la tabla a medida que se juegan los partidos.' },
    { q: '¿Necesito saber de crypto para jugar?', a: 'No. Si sabés mandar un mail, sabés jugar. La parte técnica corre por debajo; vos solo predecís partidos.' },
    { q: '¿Cómo participo?', a: 'Sumate a la waiting list para enterarte primero del lanzamiento. Cuando abramos, vas a poder conseguir tu cartón en menos de un minuto.' },
    { q: '¿Qué puedo ganar?', a: 'Premios reales para los primeros puestos del ranking. Los detalles exactos se publican junto al lanzamiento — sin letra chica.' },
    { q: '¿Cuándo se lanza?', a: 'Antes del silbatazo inicial del Mundial 2026. La fecha exacta la anunciamos por la waiting list.' },
    { q: '¿Qué significa que sea onchain?', a: 'Significa que las reglas del juego, los puntajes y los premios son verificables públicamente. Nadie puede modificar el ranking ni el pozo a mano. Confianza por diseño, no por promesa.' },
  ];
  const [open, setOpen] = useState_s(0);

  return (
    <section id="faq" style={{
      background: 'var(--ink)', color: 'var(--bone)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: isMobile ? '56px 22px 64px' : '112px 56px 128px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: isMobile ? 22 : 32 }}>
          <span style={{ width: 28, height: 1, background: 'var(--celeste)' }} />
          <span className="eyebrow celeste">Preguntas frecuentes</span>
        </div>

        <h2 className="display" style={{
          fontSize: isMobile ? 'clamp(44px, 12vw, 60px)' : 'clamp(64px, 6vw, 100px)',
          margin: 0, color: 'var(--bone)',
          marginBottom: isMobile ? 28 : 48,
        }}>
          ¿Tenés <span className="editorial" style={{ color: 'var(--celeste)', textTransform: 'none', fontStyle: 'italic' }}>dudas</span>? Las sacamos.
        </h2>

        <div style={{ borderTop: '1px solid var(--line)' }}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: 'transparent', border: 'none',
                    padding: isMobile ? '20px 0' : '28px 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', color: 'var(--bone)', gap: 24,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span className="mono" style={{
                      fontSize: 11, letterSpacing: '0.16em',
                      color: 'var(--muted)', minWidth: 32,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="display" style={{
                      fontSize: isMobile ? 20 : 28,
                      color: isOpen ? 'var(--celeste)' : 'var(--bone)',
                      transition: 'color 160ms ease',
                    }}>
                      {it.q}
                    </span>
                  </span>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: '1px solid var(--line-2)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 200ms ease',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14, lineHeight: 1, color: 'var(--bone)' }}>+</span>
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 240 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 280ms ease',
                }}>
                  <div style={{
                    paddingLeft: isMobile ? 48 : 48,
                    paddingRight: 48,
                    paddingBottom: isMobile ? 22 : 28,
                    fontSize: isMobile ? 15 : 16,
                    lineHeight: 1.6,
                    color: 'var(--bone-2)',
                    maxWidth: 720,
                  }}>
                    {it.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------
function Footer({ isMobile, onApp }) {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--bone)' }}>
      <StripeBar height={isMobile ? 4 : 6} />

      {/* big wordmark */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: isMobile ? '40px 22px 24px' : '64px 56px 32px',
      }}>
        <div className="display" style={{
          fontSize: isMobile ? 'clamp(56px, 18vw, 84px)' : 'clamp(160px, 18vw, 280px)',
          color: 'var(--bone)',
          lineHeight: 0.85,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          PRODEFI
        </div>

        <div style={{
          marginTop: isMobile ? 24 : 40,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          gap: isMobile ? 24 : 32,
          paddingTop: isMobile ? 20 : 32,
          borderTop: '1px solid var(--line)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Producto</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onApp(); }}
              style={{ textDecoration: 'none', color: 'var(--bone)', fontSize: 15 }}>
              Ir a la app →
            </a>
            <a href="#waitlist" style={{ textDecoration: 'none', color: 'var(--bone-2)', fontSize: 15 }}>
              Waiting list
            </a>
            <a href="#faq" style={{ textDecoration: 'none', color: 'var(--bone-2)', fontSize: 15 }}>
              FAQ
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Comunidad</span>
            <a href="#" style={{ textDecoration: 'none', color: 'var(--bone-2)', fontSize: 15 }}>Twitter / X</a>
            <a href="#" style={{ textDecoration: 'none', color: 'var(--bone-2)', fontSize: 15 }}>Instagram</a>
            <a href="#" style={{ textDecoration: 'none', color: 'var(--bone-2)', fontSize: 15 }}>Discord</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Estado</span>
            <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              Lanzamiento en preparacion para el Mundial 2026.
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }}>
              Hecho en Argentina, con la pelota en los pies.
            </span>
          </div>
        </div>

        <div style={{
          marginTop: isMobile ? 28 : 40,
          paddingTop: 20,
          borderTop: '1px solid var(--line)',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          fontFamily: 'JetBrains Mono', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          <span>© 2026 ProDefi · Todos los partidos</span>
          <span>v0.1 · Beta</span>
        </div>
      </div>
    </footer>
  );
}

window.Countdown = Countdown;
window.Premios = Premios;
window.Waitlist = Waitlist;
window.FAQ = FAQ;
window.Footer = Footer;
