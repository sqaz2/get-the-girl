import { useState, useEffect } from 'react'

const toneOptions = [
  { key: 'warm', label: 'Warm' },
  { key: 'curious', label: 'Curious' },
  { key: 'playful', label: 'Playful' },
  { key: 'sincere', label: 'Sincere' },
]

const defaultValues = ['', '', '', '', '']
const defaultBoundaries = ['No late-night messages', 'No love-bombing', 'Ask for consent before sharing invites']

export default function Onboarding({
  initial,
  onSave,
  onClose,
  loading,
}) {
  const [toneDefaults, setToneDefaults] = useState(initial?.toneDefaults || ['warm'])
  const [values, setValues] = useState(initial?.valuesList?.length ? initial.valuesList : defaultValues)
  const [boundaries, setBoundaries] = useState(
    initial?.boundaries?.length ? initial.boundaries : defaultBoundaries,
  )
  const [intentStatement, setIntentStatement] = useState(initial?.intentStatement || '')
  const [intentions, setIntentions] = useState(initial?.intentions?.join('\n') || '')
  const [contextNote, setContextNote] = useState(initial?.contextNote || '')
  const [errors, setErrors] = useState([])

  useEffect(() => {
    setErrors([])
  }, [toneDefaults, values, boundaries, intentStatement, intentions, contextNote])

  const toggleTone = (tone) => {
    setToneDefaults((prev) => {
      if (prev.includes(tone)) {
        return prev.filter((item) => item !== tone)
      }
      return [...prev, tone]
    })
  }

  const handleValueChange = (index, value) => {
    setValues((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleBoundaryChange = (index, value) => {
    setBoundaries((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanedValues = values.map((value) => value.trim()).filter(Boolean)
    const cleanedBoundaries = boundaries.map((value) => value.trim()).filter(Boolean)
    const cleanedIntentions = intentions
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)

    const newErrors = []
    if (!toneDefaults.length) newErrors.push('Pick at least one tone default.')
    if (cleanedValues.length < 3) newErrors.push('List at least three values that anchor you.')
    if (!intentStatement.trim()) newErrors.push('Add a one-sentence intent statement.')
    if (!contextNote.trim()) newErrors.push('Add a quick context note.')

    if (newErrors.length) {
      setErrors(newErrors)
      return
    }

    onSave({
      toneDefaults,
      valuesList: cleanedValues,
      boundaries: cleanedBoundaries,
      intentions: cleanedIntentions,
      intentStatement: intentStatement.trim(),
      contextNote: contextNote.trim(),
      createdAt: initial?.createdAt || Date.now(),
    })
  }

  return (
    <div className="card">
      <h2>1-minute grounding</h2>
      <p>
        Capture your anchors so every draft honors authenticity, boundaries, and her pace. The app
        remembers this on-device and in your Firebase space.
      </p>
      {errors.length ? (
        <div className="helper-card warning">
          <strong>Quick fixes:</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="field-group">
        <div>
          <label>Tone defaults</label>
          <div className="tag-cloud">
            {toneOptions.map((tone) => (
              <button
                key={tone.key}
                type="button"
                className={toneDefaults.includes(tone.key) ? 'active' : ''}
                onClick={() => toggleTone(tone.key)}
              >
                {tone.label}
              </button>
            ))}
          </div>
          <p className="note">These presets nudge your drafts when you tap tone helpers later.</p>
        </div>

        <div>
          <label htmlFor="values">Top values (aim for 5)</label>
          {values.map((value, index) => (
            <input
              key={index}
              id={`value-${index}`}
              type="text"
              placeholder={`Value ${index + 1}`}
              value={value}
              onChange={(event) => handleValueChange(index, event.target.value)}
            />
          ))}
        </div>

        <div>
          <label htmlFor="boundaries">Boundaries & guardrails</label>
          {boundaries.map((value, index) => (
            <input
              key={index}
              id={`boundary-${index}`}
              type="text"
              placeholder="Boundary or reminder"
              value={value}
              onChange={(event) => handleBoundaryChange(index, event.target.value)}
            />
          ))}
          <p className="note">Feel free to replace or delete defaults that don\'t resonate.</p>
        </div>

        <div>
          <label htmlFor="intentStatement">Intent statement</label>
          <textarea
            id="intentStatement"
            placeholder="Why reach out? What\'s the honest intention?"
            value={intentStatement}
            onChange={(event) => setIntentStatement(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="intentions">Intentions (optional list)</label>
          <textarea
            id="intentions"
            placeholder={"List 1-3 bullets—one per line—e.g.\n• Offer a thoughtful question\n• Share appreciation"}
            value={intentions}
            onChange={(event) => setIntentions(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contextNote">Context note</label>
          <textarea
            id="contextNote"
            placeholder="Where did we meet? How long has it been? Any details to remember?"
            value={contextNote}
            onChange={(event) => setContextNote(event.target.value)}
          />
        </div>

        <div className="flex-between" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save grounding'}
          </button>
          {onClose ? (
            <button type="button" className="ghost" onClick={onClose}>
              Close
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
