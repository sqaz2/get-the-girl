import { useEffect, useMemo, useState } from 'react'
import { STARTER_TEMPLATES, DEFAULT_SLIDERS, buildStarterPreview } from '../data/starters'

const sliderLabels = {
  formality: 'Formality',
  playfulness: 'Playfulness',
  vulnerability: 'Vulnerability',
  length: 'Length',
}

const categoryOpenerMap = {
  Reconnection: 'reconnect',
  'Shared Moment Callback': 'callback',
  'Thoughtful Question': 'followup',
  'Light Invite': 'invite',
  'Gratitude/Admiration': 'callback',
  'Playful but Respectful': 'callback',
}

function normalizeStarter(starter) {
  const template = STARTER_TEMPLATES.find((item) => item.id === starter.id) || starter
  const sliders = starter.sliders || { ...DEFAULT_SLIDERS }
  const preview = starter.preview || buildStarterPreview(template, sliders)
  return { ...template, ...starter, sliders, preview }
}

export default function StarterStudio({ starters = [], onCopy, onSaveStarter, loading }) {
  const templateMap = useMemo(
    () => Object.fromEntries(STARTER_TEMPLATES.map((template) => [template.id, template])),
    [],
  )

  const [localStarters, setLocalStarters] = useState(() =>
    starters.map((starter) => normalizeStarter(starter, templateMap)),
  )

  useEffect(() => {
    setLocalStarters(starters.map((starter) => normalizeStarter(starter, templateMap)))
  }, [starters, templateMap])

  const handleSliderChange = (starterId, sliderKey, value) => {
    setLocalStarters((prev) =>
      prev.map((starter) => {
        if (starter.id !== starterId) return starter
        const nextSliders = { ...starter.sliders, [sliderKey]: Number(value) }
        const template = templateMap[starter.id] || starter
        return {
          ...starter,
          sliders: nextSliders,
          preview: buildStarterPreview(template, nextSliders),
        }
      }),
    )
  }

  const handlePreviewChange = (starterId, value) => {
    setLocalStarters((prev) =>
      prev.map((starter) =>
        starter.id === starterId
          ? {
              ...starter,
              preview: value,
            }
          : starter,
      ),
    )
  }

  const handleReset = (starterId) => {
    setLocalStarters((prev) =>
      prev.map((starter) => {
        if (starter.id !== starterId) return starter
        const template = templateMap[starter.id] || starter
        return {
          ...starter,
          sliders: { ...DEFAULT_SLIDERS },
          preview: buildStarterPreview(template, DEFAULT_SLIDERS),
        }
      }),
    )
  }

  const handleSave = async (starter) => {
    if (!onSaveStarter) return
    const openerType = categoryOpenerMap[starter.category] || 'reconnect'
    await onSaveStarter({ ...starter, openerType })
  }

  const handleCopy = (starter) => {
    const openerType = categoryOpenerMap[starter.category] || 'reconnect'
    onCopy?.({
      text: starter.preview,
      tone: starter.tags || [],
      openerType,
    })
  }

  return (
    <div>
      <div className="card">
        <h2>Conversation starter studio</h2>
        <p>
          Tailored prompts tuned for INFJ depth. Adjust the sliders, tweak the copy, and copy a starter
          into the composer when it feels right.
        </p>
      </div>
      {localStarters.map((starter) => (
        <div className="card" key={starter.id}>
          <div className="flex-between">
            <div>
              <h3>{starter.title}</h3>
              <p className="small-label">{starter.category}</p>
            </div>
            <div className="chip-row">
              {(starter.tags || []).map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p>{starter.description}</p>
          <div className="slider-group">
            {Object.entries(sliderLabels).map(([key, label]) => (
              <label key={key} htmlFor={`${starter.id}-${key}`}>
                <span>{label}</span>
                <input
                  id={`${starter.id}-${key}`}
                  type="range"
                  min="0"
                  max="100"
                  value={starter.sliders?.[key] ?? DEFAULT_SLIDERS[key]}
                  onChange={(event) => handleSliderChange(starter.id, key, event.target.value)}
                />
              </label>
            ))}
          </div>
          <label htmlFor={`${starter.id}-preview`} style={{ marginTop: '0.75rem' }}>
            Live preview
          </label>
          <textarea
            id={`${starter.id}-preview`}
            value={starter.preview}
            onChange={(event) => handlePreviewChange(starter.id, event.target.value)}
          />
          <div className="flex-row" style={{ justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <div className="flex-row">
              <button type="button" className="secondary" onClick={() => handleReset(starter.id)}>
                Reset template
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => handleSave(starter)}
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Save adjustments'}
              </button>
            </div>
            <button type="button" onClick={() => handleCopy(starter)}>
              Copy to draft
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
