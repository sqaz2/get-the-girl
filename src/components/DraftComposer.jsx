import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { analyzeDraft } from '../utils/ethics'
import {
  applyTonePreset,
  applyToneCooldown,
  applyVulnerabilityLevel,
  applySeductiveMode,
  summarizeToneUsage,
} from '../utils/tone'
import {
  DAYS_OF_WEEK,
  antiSpamFeedback,
  formatSendWindow,
  normalizeLateNight,
  suggestSendWindow,
} from '../utils/schedule'

const tonePresets = [
  { key: 'warm', label: 'Warm' },
  { key: 'curious', label: 'Curious' },
  { key: 'playful', label: 'Playful' },
  { key: 'sincere', label: 'Sincere' },
]

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'revised', label: 'Revised' },
  { value: 'ready', label: 'Ready' },
]

const selfCheckPrompts = [
  'Am I being distinctive for authenticity or for effect?',
  'Is this direct without steamrolling her cadence?',
  'Did I leave genuine room for her to pass or reply when ready?',
]

function ensureDraftDefaults(draft, toneDefaults, intake) {
  if (draft) return draft
  const sendSuggestion = suggestSendWindow(intake?.boundaries || [])
  return {
    text: '',
    tone: toneDefaults?.length ? [...toneDefaults] : ['warm'],
    openerType: 'reconnect',
    targetChannel: 'Messenger',
    sendWindow: { dayOfWeek: sendSuggestion.day, timeLocal: sendSuggestion.time },
    status: 'new',
    ethics: { grade: 'Green', notes: [] },
    vulnerabilityLevel: 'medium',
  }
}

export default function DraftComposer({
  currentDraft,
  setCurrentDraft,
  drafts = [],
  onSaveDraft,
  onDeleteDraft,
  onSelectDraft,
  intake,
  seductiveMode,
  toneDefaults,
  onToast,
}) {
  const baseDraft = ensureDraftDefaults(currentDraft, toneDefaults, intake)
  const [draftState, setDraftState] = useState(baseDraft)
  const [analysis, setAnalysis] = useState(() => analyzeDraft(baseDraft.text, { seductiveMode }))
  const [overrideNote, setOverrideNote] = useState(baseDraft.overrideNote || '')
  const [showOverride, setShowOverride] = useState(false)
  const [showMessengerModal, setShowMessengerModal] = useState(false)
  const [handoffDraft, setHandoffDraft] = useState(null)
  const [checklist, setChecklist] = useState({ respectful: false, pressure: false, receive: false, okNoReply: false })
  const [selfCheck, setSelfCheck] = useState({})
  const [coolDown, setCoolDown] = useState(false)
  const [vulnerabilityLevel, setVulnerabilityLevel] = useState(baseDraft.vulnerabilityLevel || 'medium')

  useEffect(() => {
    setDraftState(ensureDraftDefaults(currentDraft, toneDefaults, intake))
    setOverrideNote(currentDraft?.overrideNote || '')
    setVulnerabilityLevel(currentDraft?.vulnerabilityLevel || 'medium')
  }, [currentDraft, toneDefaults, intake])

  useEffect(() => {
    setAnalysis(analyzeDraft(draftState.text, { seductiveMode }))
  }, [draftState.text, seductiveMode])

  useEffect(() => {
    setCurrentDraft(draftState)
  }, [draftState, setCurrentDraft])

  const charCount = draftState.text.length
  const lineCount = draftState.text ? draftState.text.split(/\r?\n/).length : 0

  const spamFeedback = useMemo(() => antiSpamFeedback(drafts), [drafts])

  const handleToneToggle = (tone) => {
    setDraftState((prev) => {
      const toneSet = new Set(prev.tone || [])
      if (toneSet.has(tone)) {
        toneSet.delete(tone)
      } else {
        toneSet.add(tone)
      }
      let nextText = prev.text
      nextText = applyTonePreset(nextText, tone, { defaults: toneDefaults || [] })
      if (coolDown) {
        nextText = applyToneCooldown(nextText)
      }
      if (seductiveMode) {
        nextText = applySeductiveMode(nextText)
      }
      nextText = applyVulnerabilityLevel(nextText, vulnerabilityLevel)
      return {
        ...prev,
        tone: Array.from(toneSet),
        text: nextText,
      }
    })
  }

  const handleToneCooldown = (checked) => {
    setCoolDown(checked)
    if (!checked) return
    setDraftState((prev) => ({
      ...prev,
      text: applyToneCooldown(prev.text),
    }))
  }

  const handleVulnerability = (level) => {
    setVulnerabilityLevel(level)
    setDraftState((prev) => ({
      ...prev,
      vulnerabilityLevel: level,
      text: applyVulnerabilityLevel(prev.text, level),
    }))
  }

  const handleSeductiveAssist = () => {
    setDraftState((prev) => ({
      ...prev,
      text: applySeductiveMode(prev.text),
    }))
  }

  const handleSendWindowChange = (key, value) => {
    setDraftState((prev) => {
      const sendWindow = { ...(prev.sendWindow || {}) }
      if (key === 'dayOfWeek') {
        sendWindow.dayOfWeek = value
      } else {
        sendWindow.timeLocal = value
      }
      const fallbackDay =
        sendWindow.dayOfWeek || prev.sendWindow?.dayOfWeek || suggestSendWindow(intake?.boundaries || []).day
      const fallbackTime = sendWindow.timeLocal || prev.sendWindow?.timeLocal || '18:30'
      const normalized = normalizeLateNight(fallbackDay, fallbackTime)
      return {
        ...prev,
        sendWindow: { dayOfWeek: normalized.day, timeLocal: normalized.time },
      }
    })
  }

  const handleStatusChange = (value) => {
    setDraftState((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const readyToSave = analysis.grade !== 'Red' || (showOverride && overrideNote.trim().length > 5)

  const handleSave = async () => {
    if (!readyToSave) {
      onToast?.('Add an override reflection before saving a Red-flagged draft.', 'warning')
      return
    }
    const payload = {
      ...draftState,
      text: draftState.text.trim(),
      tone: draftState.tone?.length ? draftState.tone : toneDefaults || [],
      targetChannel: 'Messenger',
      ethics: {
        grade: analysis.grade,
        notes: showOverride && overrideNote ? [overrideNote.trim(), ...analysis.notes] : analysis.notes,
        suggestions: analysis.suggestions,
      },
      overrideNote: showOverride ? overrideNote.trim() : '',
    }
    await onSaveDraft(payload)
    setSelfCheck({})
    setCoolDown(false)
    setOverrideNote('')
    setShowOverride(false)
    onToast?.('Draft saved', 'success')
  }

  const handleDelete = async (id) => {
    await onDeleteDraft(id)
    onToast?.('Draft removed', 'warning')
  }

  const openMessengerModal = (draft) => {
    setHandoffDraft(draft)
    setChecklist({ respectful: false, pressure: false, receive: false, okNoReply: false })
    setShowMessengerModal(true)
  }

  const handleMessengerHandoff = async () => {
    if (!handoffDraft) return
    try {
      await navigator.clipboard.writeText(handoffDraft.text)
      onToast?.('Copied to clipboard. Opening Messenger…', 'success')
    } catch (error) {
      console.warn(error)
      onToast?.('Copy failed. Manually copy the draft before sending.', 'warning')
    }
    window.open('https://www.messenger.com/t/', '_blank')
    setShowMessengerModal(false)
  }

  const toneCounts = useMemo(() => summarizeToneUsage(drafts), [drafts])
  const sendSuggestion = suggestSendWindow(intake?.boundaries || [])

  return (
    <div>
      <div className="card">
        <h2>Draft composer</h2>
        <p>
          Craft messages that balance warmth, curiosity, and respect. The ethics checker keeps each draft
          within green or yellow territory unless you reflect on an intentional override.
        </p>
        <textarea
          className="rich-text"
          value={draftState.text}
          placeholder="Start typing or paste from a starter. Keep it grounded, specific, and consent-centered."
          onChange={(event) =>
            setDraftState((prev) => ({
              ...prev,
              text: event.target.value,
            }))
          }
        />
        <div className="counter-row">
          <span>{charCount} characters · {lineCount} lines</span>
          <span>Target channel: Messenger only (manual send)</span>
        </div>
        <div className="flex-row" style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {tonePresets.map((tone) => (
            <button
              key={tone.key}
              type="button"
              className={draftState.tone?.includes(tone.key) ? '' : 'secondary'}
              onClick={() => handleToneToggle(tone.key)}
            >
              {tone.label}
            </button>
          ))}
        </div>
        <div className="flex-row" style={{ marginTop: '0.75rem', alignItems: 'center' }}>
          <label className="inline-field" style={{ flex: 1 }}>
            <input
              type="checkbox"
              checked={coolDown}
              onChange={(event) => handleToneCooldown(event.target.checked)}
            />
            Tone cool-down
          </label>
          <label className="inline-field" style={{ flex: 1 }}>
            Vulnerability
            <select
              value={vulnerabilityLevel}
              onChange={(event) => handleVulnerability(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          {seductiveMode ? (
            <button type="button" className="ghost" onClick={handleSeductiveAssist}>
              Reinforce boundaries
            </button>
          ) : null}
        </div>

        <div className={`badge ${analysis.grade.toLowerCase()}`} style={{ marginTop: '0.75rem' }}>
          Ethics grade: {analysis.grade}
        </div>
        <ul className="ethics-notes">
          {analysis.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        {analysis.suggestions.length ? (
          <div className="helper-card">
            <strong>Clarity coach</strong>
            {analysis.suggestions.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        ) : null}
        {spamFeedback ? (
          <div className={`helper-card ${spamFeedback.level === 'caution' ? 'danger' : 'warning'}`}>
            <strong>Anti-spam coach</strong>
            <p>{spamFeedback.message}</p>
          </div>
        ) : null}

        <div className="layout-grid" style={{ marginTop: '0.75rem' }}>
          <div>
            <label>Opener type</label>
            <select
              value={draftState.openerType}
              onChange={(event) =>
                setDraftState((prev) => ({
                  ...prev,
                  openerType: event.target.value,
                }))
              }
            >
              <option value="reconnect">Reconnection</option>
              <option value="callback">Shared moment callback</option>
              <option value="followup">Thoughtful follow-up</option>
              <option value="invite">Invite</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={draftState.status} onChange={(event) => handleStatusChange(event.target.value)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="layout-grid" style={{ marginTop: '0.75rem' }}>
          <div>
            <label>Send day</label>
            <select
              value={draftState.sendWindow?.dayOfWeek || sendSuggestion.day}
              onChange={(event) => handleSendWindowChange('dayOfWeek', event.target.value)}
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Send time (local)</label>
            <input
              type="time"
              value={draftState.sendWindow?.timeLocal || sendSuggestion.time}
              onChange={(event) => handleSendWindowChange('timeLocal', event.target.value)}
            />
          </div>
        </div>
        <p className="note">
          Send window helper suggests {sendSuggestion.day} around {sendSuggestion.time}. Late-night selections are
          auto-shifted to respectful evening hours.
        </p>

        {analysis.grade === 'Red' ? (
          <div className="helper-card danger">
            <strong>Override required</strong>
            <p>
              This draft is currently blocked. To proceed you must reflect on why you believe the language is
              still respectful and note adjustments you will make when sending.
            </p>
            <button type="button" className="ghost" onClick={() => setShowOverride((prev) => !prev)}>
              {showOverride ? 'Hide override' : 'Override with reflection'}
            </button>
            {showOverride ? (
              <textarea
                placeholder="What will you adjust or be mindful of so this stays ethical?"
                value={overrideNote}
                onChange={(event) => setOverrideNote(event.target.value)}
              />
            ) : null}
          </div>
        ) : null}

        <div className="helper-card" style={{ marginTop: '0.75rem' }}>
          <strong>ENTP 4/8 self-check</strong>
          <ul>
            {selfCheckPrompts.map((prompt) => (
              <li key={prompt} style={{ listStyle: 'none', marginBottom: '0.35rem' }}>
                <label className="inline-field">
                  <input
                    type="checkbox"
                    checked={selfCheck[prompt] || false}
                    onChange={(event) =>
                      setSelfCheck((prev) => ({
                        ...prev,
                        [prompt]: event.target.checked,
                      }))
                    }
                  />
                  {prompt}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-between" style={{ marginTop: '0.75rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleSave} disabled={!draftState.text.trim()}>
            Save draft
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => setDraftState(ensureDraftDefaults(null, toneDefaults, intake))}
          >
            Clear composer
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Saved drafts</h3>
        <p className="note">Tap a draft to continue editing or hand it off to Messenger.</p>
        {drafts.length === 0 ? (
          <div className="empty-state">No drafts yet. Save one from the composer above.</div>
        ) : (
          <div className="timeline">
            {drafts.map((draft) => (
              <div key={draft.id} className="timeline-item">
                <div className="flex-between">
                  <h4>{draft.openerType || 'draft'}</h4>
                  <span className={`badge ${draft.ethics?.grade?.toLowerCase() || 'green'}`}>
                    {draft.ethics?.grade || 'Green'}
                  </span>
                </div>
                <p>{draft.text}</p>
                <div className="counter-row" style={{ marginTop: '0.5rem' }}>
                  <span>{formatSendWindow(draft.sendWindow)}</span>
                  <span>{draft.status}</span>
                </div>
                <div className="flex-row" style={{ marginTop: '0.65rem', flexWrap: 'wrap' }}>
                  <button type="button" className="ghost" onClick={() => onSelectDraft(draft)}>
                    Edit in composer
                  </button>
                  <button type="button" onClick={() => openMessengerModal(draft)}>
                    Copy & open Messenger
                  </button>
                  <button type="button" className="ghost" onClick={() => handleDelete(draft.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Draft insights</h3>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="small-label">Warm</span>
            <strong>{toneCounts.warm}</strong>
          </div>
          <div className="stat-card">
            <span className="small-label">Curious</span>
            <strong>{toneCounts.curious}</strong>
          </div>
          <div className="stat-card">
            <span className="small-label">Playful</span>
            <strong>{toneCounts.playful}</strong>
          </div>
          <div className="stat-card">
            <span className="small-label">Sincere</span>
            <strong>{toneCounts.sincere}</strong>
          </div>
        </div>
      </div>

      <Modal
        open={showMessengerModal}
        onClose={() => setShowMessengerModal(false)}
        title="Messenger handoff"
        footer={
          <button
            type="button"
            onClick={handleMessengerHandoff}
            disabled={!Object.values(checklist).every(Boolean)}
          >
            Copy & open Messenger
          </button>
        }
      >
        <p>
          Manual send only. Before you hop over, pause for a final gut-check and keep consent centered.
        </p>
        <ul className="checklist">
          <li>
            <label>
              <input
                type="checkbox"
                checked={checklist.respectful}
                onChange={(event) =>
                  setChecklist((prev) => ({ ...prev, respectful: event.target.checked }))
                }
              />
              Is this respectful of her pace and boundaries?
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={checklist.pressure}
                onChange={(event) => setChecklist((prev) => ({ ...prev, pressure: event.target.checked }))}
              />
              Is there zero pressure or obligation implied?
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={checklist.receive}
                onChange={(event) => setChecklist((prev) => ({ ...prev, receive: event.target.checked }))}
              />
              Would you be comfortable receiving this exact message?
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={checklist.okNoReply}
                onChange={(event) => setChecklist((prev) => ({ ...prev, okNoReply: event.target.checked }))}
              />
              Are you okay if there is no reply?
            </label>
          </li>
        </ul>
      </Modal>
    </div>
  )
}
