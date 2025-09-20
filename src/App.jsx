import { useEffect, useMemo, useState } from 'react'
import BottomNav from './components/BottomNav'
import StarterStudio from './components/StarterStudio'
import DraftComposer from './components/DraftComposer'
import ScheduleBoard from './components/ScheduleBoard'
import Reflections from './components/Reflections'
import SettingsPanel from './components/SettingsPanel'
import Onboarding from './components/Onboarding'
import { loadLocal, removeLocal, saveLocal } from './utils/local'
import { starterSeedData } from './data/starters'
import { demoIntake, demoDrafts, demoReflections, buildDemoStarters } from './data/demo'

const LOCAL_KEYS = {
  intake: 'gtg-intake',
  starters: 'gtg-starters',
  drafts: 'gtg-drafts',
  reflections: 'gtg-reflections',
  currentDraft: 'gtg-current-draft',
  settings: 'gtg-settings',
}

const defaultSettings = { seductiveMode: false }

export default function App() {
  const storedSettings = loadLocal(LOCAL_KEYS.settings, defaultSettings) || defaultSettings
  const [activeTab, setActiveTab] = useState('starters')
  const [intake, setIntake] = useState(() => loadLocal(LOCAL_KEYS.intake, null))
  const [starters, setStarters] = useState(() => loadLocal(LOCAL_KEYS.starters, []))
  const [drafts, setDrafts] = useState(() => loadLocal(LOCAL_KEYS.drafts, []))
  const [reflections, setReflections] = useState(() => loadLocal(LOCAL_KEYS.reflections, []))
  const [currentDraft, setCurrentDraft] = useState(() => loadLocal(LOCAL_KEYS.currentDraft, null))
  const [seductiveMode, setSeductiveMode] = useState(
    typeof storedSettings?.seductiveMode === 'boolean'
      ? storedSettings.seductiveMode
      : defaultSettings.seductiveMode,
  )
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handler = (event) => {
      setInstallPrompt(event.detail)
    }
    window.addEventListener('app-install-prompt', handler)
    return () => window.removeEventListener('app-install-prompt', handler)
  }, [])

  const showToast = (message, type = 'default') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3200)
  }

  const seedStarters = (force = false) => {
    if (starters.length && !force) return starters
    const seeds = starterSeedData()
    setStarters(seeds)
    return seeds
  }

  useEffect(() => {
    if (!starters.length) {
      seedStarters(true)
    }
    if (!intake) {
      setShowOnboarding(true)
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.settings, { seductiveMode })
  }, [seductiveMode])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.intake, intake)
  }, [intake])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.starters, starters)
  }, [starters])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.drafts, drafts)
  }, [drafts])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.reflections, reflections)
  }, [reflections])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.currentDraft, currentDraft)
  }, [currentDraft])

  useEffect(() => {
    if (!intake && !loading) {
      setShowOnboarding(true)
    }
  }, [intake, loading])

  const handleSaveIntake = (payload) => {
    setIntake(payload)
    setShowOnboarding(false)
    showToast('Grounding saved locally', 'success')
  }

  const handleCopyStarter = ({ text, tone, openerType }) => {
    setCurrentDraft((prev) => ({
      ...(prev || {}),
      text,
      tone,
      openerType: openerType || prev?.openerType || 'reconnect',
      targetChannel: 'Messenger',
    }))
    setActiveTab('compose')
    showToast('Starter copied into composer', 'success')
  }

  const handleSaveStarter = (starter) => {
    const updated = { ...starter, preview: starter.preview, sliders: starter.sliders }
    setStarters((prev) => {
      const exists = prev.find((item) => item.id === starter.id)
      if (exists) {
        return prev.map((item) => (item.id === starter.id ? { ...item, ...updated } : item))
      }
      return [...prev, { ...updated, id: starter.id || `local-${Date.now()}` }]
    })
    showToast('Starter saved locally', 'success')
  }

  const handleSaveDraft = (draft) => {
    const timestamp = Date.now()
    const saved = {
      ...draft,
      id: draft.id || `local-${timestamp}`,
      updatedAt: timestamp,
      createdAt:
        typeof draft.createdAt === 'number' && Number.isFinite(draft.createdAt)
          ? draft.createdAt
          : timestamp,
    }
    setDrafts((prev) => {
      const exists = prev.find((item) => item.id === saved.id)
      if (exists) {
        return prev.map((item) => (item.id === saved.id ? saved : item))
      }
      return [saved, ...prev]
    })
  }

  const handleDeleteDraft = (draftId) => {
    setDrafts((prev) => prev.filter((item) => item.id !== draftId))
  }

  const handleSaveReflection = (reflection) => {
    const saved = {
      ...reflection,
      id: reflection.id || `local-ref-${Date.now()}`,
      updatedAt: Date.now(),
      createdAt:
        typeof reflection.createdAt === 'number' && Number.isFinite(reflection.createdAt)
          ? reflection.createdAt
          : Date.now(),
    }
    setReflections((prev) => {
      const exists = prev.find((item) => item.id === saved.id)
      if (exists) {
        return prev.map((item) => (item.id === saved.id ? saved : item))
      }
      return [saved, ...prev]
    })
    showToast('Reflection saved', 'success')
  }

  const handleSelectDraft = (draft) => {
    setCurrentDraft(draft)
    setActiveTab('compose')
  }

  const handleSeedStarters = () => {
    seedStarters(true)
    showToast('Starter library refreshed', 'success')
  }

  const handleClearLocal = () => {
    Object.values(LOCAL_KEYS).forEach((key) => removeLocal(key))
    setIntake(null)
    setStarters([])
    setDrafts([])
    setReflections([])
    setCurrentDraft(null)
    showToast('Local data cleared. Onboarding will reopen next.', 'warning')
  }

  const handleLoadSample = () => {
    setIntake(demoIntake)
    setStarters(buildDemoStarters())
    setDrafts(demoDrafts)
    setReflections(demoReflections)
    setCurrentDraft(null)
    setShowOnboarding(false)
    showToast('Sample workspace loaded locally.', 'success')
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') {
      showToast('App installed—ready for offline coaching.', 'success')
    }
    setInstallPrompt(null)
  }

  const activeContent = useMemo(() => {
    switch (activeTab) {
      case 'starters':
        return (
          <StarterStudio
            starters={starters}
            onCopy={handleCopyStarter}
            onSaveStarter={handleSaveStarter}
            loading={loading}
          />
        )
      case 'compose':
        return (
          <DraftComposer
            currentDraft={currentDraft}
            setCurrentDraft={setCurrentDraft}
            drafts={drafts}
            onSaveDraft={handleSaveDraft}
            onDeleteDraft={handleDeleteDraft}
            onSelectDraft={handleSelectDraft}
            intake={intake}
            seductiveMode={seductiveMode}
            toneDefaults={intake?.toneDefaults || []}
            onToast={showToast}
          />
        )
      case 'schedule':
        return <ScheduleBoard drafts={drafts} reflections={reflections} />
      case 'reflections':
        return (
          <Reflections drafts={drafts} reflections={reflections} onSaveReflection={handleSaveReflection} />
        )
      case 'settings':
        return (
          <SettingsPanel
            intake={intake}
            seductiveMode={seductiveMode}
            onToggleSeductiveMode={setSeductiveMode}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onSeedStarters={handleSeedStarters}
            onClearLocal={handleClearLocal}
            onLoadSample={handleLoadSample}
            installPrompt={installPrompt}
            onInstall={handleInstall}
          />
        )
      default:
        return null
    }
  }, [activeTab, starters, loading, currentDraft, drafts, intake, seductiveMode, reflections, installPrompt])

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Considerate Outreach Studio</h1>
        <p>Craft grounded Messenger drafts for thoughtful INFJ reconnection—manual send only.</p>
      </header>
      <main className="app-main">
        {loading ? (
          <div className="card">Loading your workspace…</div>
        ) : null}
        {showOnboarding ? (
          <Onboarding initial={intake} onSave={handleSaveIntake} loading={loading} onClose={() => setShowOnboarding(false)} />
        ) : null}
        {activeContent}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
      {toast ? <div className={`toast ${toast.type}`}>{toast.message}</div> : null}
    </div>
  )
}
