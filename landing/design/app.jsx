/* global React, ReactDOM, Hero, Header, Countdown, Premios, Waitlist, FAQ, Footer, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakToggle, TweakText */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "viewport": "mobile",
  "targetDate": "2026-06-11T20:00:00",
  "accentMode": "lima",
  "showStripe": true,
  "heroHeadline": "Jugá al Mundial como nunca."
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // override CSS vars for accent
  React.useEffect(() => {
    const root = document.documentElement;
    if (tweaks.accentMode === 'celeste') {
      root.style.setProperty('--lima', '#74ACDF');
    } else if (tweaks.accentMode === 'warm') {
      root.style.setProperty('--lima', '#F2C14E');
    } else {
      root.style.setProperty('--lima', '#C8FF3D');
    }
  }, [tweaks.accentMode]);

  const isMobile = tweaks.viewport === 'mobile';

  const goWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const goApp = () => {
    window.alert('Ir a la app → /app (placeholder)');
  };

  return (
    <div className="stage" data-mode={tweaks.viewport}>
      <div className="device" data-screen-label="Landing">
        <Header isMobile={isMobile} />
        <Hero isMobile={isMobile} onWaitlist={goWaitlist} onApp={goApp} />
        <Countdown isMobile={isMobile} target={tweaks.targetDate} />
        <Premios isMobile={isMobile} onWaitlist={goWaitlist} />
        <Waitlist isMobile={isMobile} />
        <FAQ isMobile={isMobile} />
        <Footer isMobile={isMobile} onApp={goApp} />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Vista">
          <TweakRadio
            label="Viewport"
            value={tweaks.viewport}
            onChange={(v) => setTweak('viewport', v)}
            options={['mobile', 'desktop']}
          />
        </TweakSection>

        <TweakSection label="Identidad">
          <TweakRadio
            label="Acento CTA"
            value={tweaks.accentMode}
            onChange={(v) => setTweak('accentMode', v)}
            options={['lima', 'celeste', 'warm']}
          />
        </TweakSection>

        <TweakSection label="Countdown">
          <TweakText
            label="Fecha objetivo"
            value={tweaks.targetDate}
            onChange={(v) => setTweak('targetDate', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
