export default function SettingsPanel({
  intake,
  seductiveMode,
  onToggleSeductiveMode,
  onOpenOnboarding,
  onSeedStarters,
  onClearLocal,
  onLoadSample,
  installPrompt,
  onInstall,
}) {
  return (
    <div>
      <div className="card">
        <h2>Settings & safeguards</h2>
        <p>Everything stays manual, consent-forward, and on this device. Nothing is sent anywhere else.</p>
        <div className="helper-card">
          <strong>Current grounding</strong>
          <p className="note">Intent: {intake?.intentStatement || 'Add one in onboarding.'}</p>
          <p className="note">Values: {(intake?.valuesList || []).join(', ') || '—'}</p>
          <p className="note">Boundaries: {(intake?.boundaries || []).join(' · ') || '—'}</p>
        </div>
        <div className="flex-row" style={{ marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button type="button" onClick={onOpenOnboarding}>
            Update onboarding
          </button>
          <button type="button" className="ghost" onClick={onSeedStarters}>
            Reseed INFJ starters
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Workspace data</h3>
        <div className="helper-card">
          <p>
            Drafts, starters, and reflections live in localStorage. Load the sample workspace for a guided
            tour or clear storage to start fresh.
          </p>
          <div className="flex-row" style={{ gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button type="button" className="ghost" onClick={onLoadSample}>
              Load sample workspace
            </button>
            <button type="button" className="ghost" onClick={onClearLocal}>
              Clear local storage
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Toggles</h3>
        <div className="helper-card">
          <label className="inline-field">
            <input
              type="checkbox"
              checked={seductiveMode}
              onChange={(event) => onToggleSeductiveMode(event.target.checked)}
            />
            Seductive, Not Sleazy mode
          </label>
          <p>
            Adds gentle warmth language while enforcing strict boundaries—no innuendo, no body commentary,
            and ethics checker becomes stricter.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Install on Android</h3>
        <div className="install-banner">
          <p className="note">
            Install as a PWA for offline-first access. The layout reserves half-screen space for keyboard on
            mobile, so composing while typing stays comfortable.
          </p>
          <div className="flex-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={onInstall} disabled={!installPrompt}>
              {installPrompt ? 'Install app' : 'Use browser menu to install'}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => window.alert('In Chrome on Android: menu → Add to Home screen → follow prompts.')}
            >
              Installation steps
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Status</h3>
        <p className="note">Storage: Local browser storage + offline cache.</p>
        <p className="note">No automation, scraping, or third-party personal data. Everything stays manual.</p>
      </div>
    </div>
  )
}
