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
import {
  initFirebase,
  ensureAnonymousUser,
  ensureUserProfile,
  fetchUserBundle,
  saveIntake as saveIntakeToFirestore,
  saveDraft as saveDraftToFirestore,
  deleteDraft as deleteDraftFromFirestore,
  saveReflection as saveReflectionToFirestore,
  saveStarter as saveStarterToFirestore,
} from './firebase'

const LOCAL_KEYS = {
  intake: 'gtg-intake',
  starters: 'gtg-starters',
  drafts: 'gtg-drafts',
  reflections: 'gtg-reflections',
  currentDraft: 'gtg-current-draft',
  settings: 'gtg-settings',
}

const defaultSettings = { seductiveMode: false, demoMode: false }

export default function App() {
  const storedSettings = loadLocal(LOCAL_KEYS.settings, defaultSettings)
  const [activeTab, setActiveTab] = useState('starters')
  const [intake, setIntake] = useState(() => loadLocal(LOCAL_KEYS.intake, null))
  const [starters, setStarters] = useState(() => loadLocal(LOCAL_KEYS.starters, []))
  const [drafts, setDrafts] = useState(() => loadLocal(LOCAL_KEYS.drafts, []))
  const [reflections, setReflections] = useState(() => loadLocal(LOCAL_KEYS.reflections, []))
  const [currentDraft, setCurrentDraft] = useState(() => loadLocal(LOCAL_KEYS.currentDraft, null))
  const [seductiveMode, setSeductiveMode] = useState(storedSettings.seductiveMode || false)
  const [demoMode, setDemoMode] = useState(storedSettings.demoMode || false)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [user, setUser] = useState(null)
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

  const seedStarters = async (uid, force = false) => {
    if (starters.length && !force) return starters
    const seeds = starterSeedData()
    setStarters(seeds)
    saveLocal(LOCAL_KEYS.starters, seeds)
    if (firebaseReady && uid && !demoMode) {
      await Promise.all(seeds.map((starter) => saveStarterToFirestore(uid, starter)))
    }
    return seeds
  }

  const bootstrap = async () => {
    try {
      const firebase = await initFirebase()
      if (!firebase) {
        setFirebaseReady(false)
        setDemoMode(true)
        if (!starters.length) setStarters(buildDemoStarters())
        if (!drafts.length) setDrafts(demoDrafts)
        if (!reflections.length) setReflections(demoReflections)
        if (!intake) setIntake(demoIntake)
        setLoading(false)
        setShowOnboarding(!intake)
        return
      }
      setFirebaseReady(true)
      const authUser = await ensureAnonymousUser()
      if (!authUser) {
        setLoading(false)
        return
      }
      setUser(authUser)
      await ensureUserProfile(authUser.uid)
      const bundle = await fetchUserBundle(authUser.uid)
      if (bundle.intake) {
        setIntake(bundle.intake)
      } else {
        setShowOnboarding(true)
      }
      if (bundle.starters?.length) {
        setStarters(bundle.starters)
      } else {
        await seedStarters(authUser.uid, true)
      }
      if (bundle.drafts?.length) {
        setDrafts(bundle.drafts)
      }
      if (bundle.reflections?.length) {
        setReflections(bundle.reflections)
      }
      setLoading(false)
    } catch (error) {
      console.warn('Bootstrap error', error)
      setFirebaseReady(false)
      setDemoMode(true)
      if (!starters.length) setStarters(buildDemoStarters())
      if (!drafts.length) setDrafts(demoDrafts)
      if (!reflections.length) setReflections(demoReflections)
      if (!intake) setIntake(demoIntake)
      setLoading(false)
    }
  }

  useEffect(() => {
    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveLocal(LOCAL_KEYS.settings, { seductiveMode, demoMode })
  }, [seductiveMode, demoMode])

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

  const handleSaveIntake = async (payload) => {
    setIntake(payload)
    setShowOnboarding(false)
    if (firebaseReady && user && !demoMode) {
      await saveIntakeToFirestore(user.uid, payload)
    }
    showToast('Grounding saved', 'success')
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

  const handleSaveStarter = async (starter) => {
    const updated = { ...starter, preview: starter.preview, sliders: starter.sliders }
    setStarters((prev) => {
      const exists = prev.find((item) => item.id === starter.id)
      if (exists) {
        return prev.map((item) => (item.id === starter.id ? { ...item, ...updated } : item))
      }
      return [...prev, { ...updated, id: starter.id || `local-${Date.now()}` }]
    })
    if (firebaseReady && user && !demoMode) {
      await saveStarterToFirestore(user.uid, updated)
    }
    showToast('Starter saved', 'success')
  }

  const handleSaveDraft = async (draft) => {
    let saved = { ...draft }
    if (firebaseReady && user && !demoMode) {
      saved = await saveDraftToFirestore(user.uid, draft)
    } else {
      saved.id = draft.id || `local-${Date.now()}`
      saved.updatedAt = Date.now()
      saved.createdAt = draft.createdAt || saved.updatedAt
    }
    setDrafts((prev) => {
      const exists = prev.find((item) => item.id === saved.id)
      if (exists) {
        return prev.map((item) => (item.id === saved.id ? saved : item))
      }
      return [saved, ...prev]
    })
  }

  const handleDeleteDraft = async (draftId) => {
    if (firebaseReady && user && !demoMode) {
      await deleteDraftFromFirestore(user.uid, draftId)
    }
    setDrafts((prev) => prev.filter((item) => item.id !== draftId))
  }

  const handleSaveReflection = async (reflection) => {
    let saved = { ...reflection }
    if (firebaseReady && user && !demoMode) {
      saved = await saveReflectionToFirestore(user.uid, reflection)
    } else {
      saved.id = reflection.id || `local-ref-${Date.now()}`
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

  const handleSeedStarters = async () => {
    const seeds = await seedStarters(user?.uid, true)
    setStarters(seeds)
    showToast('Starter library refreshed', 'success')
  }

  const handleClearLocal = () => {
    Object.values(LOCAL_KEYS).forEach((key) => removeLocal(key))
    setIntake(null)
    setStarters([])
    setDrafts([])
    setReflections([])
    setCurrentDraft(null)
    showToast('Local data cleared. Refresh to reload from Firebase or demo.', 'warning')
  }

  const handleToggleDemo = (value) => {
    setDemoMode(value)
    if (value) {
      setIntake(demoIntake)
      setStarters(buildDemoStarters())
      setDrafts(demoDrafts)
      setReflections(demoReflections)
      showToast('Demo mode enabled with sample data.', 'success')
    } else {
      bootstrap()
      showToast('Exited demo mode. Syncing Firebase data.', 'success')
    }
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

  const handleSync = () => {
    if (firebaseReady && user && !demoMode) {
      bootstrap()
      showToast('Synced with Firebase', 'success')
    } else {
      showToast('Enable Firebase mode to sync.', 'warning')
    }
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
            demoMode={demoMode}
            onToggleDemo={handleToggleDemo}
            installPrompt={installPrompt}
            onInstall={handleInstall}
            firebaseReady={firebaseReady}
            onSync={handleSync}
          />
        )
      default:
        return null
    }
  }, [activeTab, starters, loading, currentDraft, drafts, intake, seductiveMode, reflections, demoMode, installPrompt, firebaseReady])

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
