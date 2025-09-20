import { useState } from 'react'
import { formatSendWindow } from '../utils/schedule'

const outcomeOptions = [
  { value: 'no-reply', label: 'No reply yet' },
  { value: 'positive', label: 'Positive response' },
  { value: 'neutral', label: 'Neutral / mixed' },
  { value: 'negative', label: 'Did not land well' },
]

const feelingTags = ['felt grounded', 'felt anxious', 'overshared', 'kept it light', 'felt proud', 'felt unsettled']

export default function Reflections({ drafts = [], reflections = [], onSaveReflection }) {
  const [selectedDraftId, setSelectedDraftId] = useState('')
  const [form, setForm] = useState({
    sentCopy: '',
    dateSent: new Date().toISOString().split('T')[0],
    responseOutcome: 'no-reply',
    selfAssessment: [],
    nextStep: '',
  })

  const selectedDraft = drafts.find((draft) => draft.id === selectedDraftId)

  const toggleFeeling = (tag) => {
    setForm((prev) => {
      const set = new Set(prev.selfAssessment)
      if (set.has(tag)) {
        set.delete(tag)
      } else {
        set.add(tag)
      }
      return { ...prev, selfAssessment: Array.from(set) }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...form,
      sentCopy: form.sentCopy.trim(),
      linkedDraftId: selectedDraftId || null,
      sendWindow: selectedDraft?.sendWindow,
    }
    onSaveReflection(payload)
    setForm({
      sentCopy: '',
      dateSent: new Date().toISOString().split('T')[0],
      responseOutcome: 'no-reply',
      selfAssessment: [],
      nextStep: '',
    })
    setSelectedDraftId('')
  }

  return (
    <div>
      <div className="card">
        <h2>Reflection log</h2>
        <p>
          After you manually send a message, capture how it felt and what happened. Patterns will surface in
          the insights above.
        </p>
        <form onSubmit={handleSubmit} className="field-group">
          <div>
            <label htmlFor="draftSelect">Linked draft (optional)</label>
            <select
              id="draftSelect"
              value={selectedDraftId}
              onChange={(event) => {
                setSelectedDraftId(event.target.value)
                const draft = drafts.find((item) => item.id === event.target.value)
                if (draft) {
                  setForm((prev) => ({
                    ...prev,
                    sentCopy: draft.text,
                  }))
                }
              }}
            >
              <option value="">Select draft</option>
              {drafts.map((draft) => (
                <option key={draft.id} value={draft.id}>
                  {draft.openerType} · {formatSendWindow(draft.sendWindow)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sentCopy">What you sent</label>
            <textarea
              id="sentCopy"
              value={form.sentCopy}
              placeholder="Paste the final message or summarize it."
              onChange={(event) => setForm((prev) => ({ ...prev, sentCopy: event.target.value }))}
            />
          </div>

          <div className="layout-grid">
            <div>
              <label htmlFor="dateSent">Date sent</label>
              <input
                id="dateSent"
                type="date"
                value={form.dateSent}
                onChange={(event) => setForm((prev) => ({ ...prev, dateSent: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="responseOutcome">Outcome</label>
              <select
                id="responseOutcome"
                value={form.responseOutcome}
                onChange={(event) => setForm((prev) => ({ ...prev, responseOutcome: event.target.value }))}
              >
                {outcomeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>How did it feel?</label>
            <div className="tag-cloud">
              {feelingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={form.selfAssessment.includes(tag) ? 'active' : ''}
                  onClick={() => toggleFeeling(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="nextStep">Next step</label>
            <textarea
              id="nextStep"
              value={form.nextStep}
              placeholder="How will you honor their response and your boundaries?"
              onChange={(event) => setForm((prev) => ({ ...prev, nextStep: event.target.value }))}
            />
          </div>

          <button type="submit">Save reflection</button>
        </form>
      </div>

      <div className="card">
        <h3>Reflection history</h3>
        {reflections.length === 0 ? (
          <div className="empty-state">No reflections logged yet.</div>
        ) : (
          <div className="timeline">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="timeline-item">
                <div className="flex-between">
                  <h4>{reflection.responseOutcome}</h4>
                  <span>{reflection.dateSent}</span>
                </div>
                <p>{reflection.sentCopy}</p>
                <p className="note">Feelings: {(reflection.selfAssessment || []).join(', ') || '—'}</p>
                <p className="note">Next step: {reflection.nextStep || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
