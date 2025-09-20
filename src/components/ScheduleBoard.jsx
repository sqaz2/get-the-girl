import { useMemo } from 'react'
import { averageLength, summarizeToneUsage } from '../utils/tone'
import { DAYS_OF_WEEK, bucketDraftsByStatus, formatSendWindow } from '../utils/schedule'

function sortBySchedule(drafts = []) {
  return [...drafts].sort((a, b) => {
    const dayA = DAYS_OF_WEEK.indexOf(a.sendWindow?.dayOfWeek || '')
    const dayB = DAYS_OF_WEEK.indexOf(b.sendWindow?.dayOfWeek || '')
    if (dayA !== dayB) return dayA - dayB
    const timeA = a.sendWindow?.timeLocal || '00:00'
    const timeB = b.sendWindow?.timeLocal || '00:00'
    return timeA.localeCompare(timeB)
  })
}

function reflectionStats(reflections = []) {
  const outcomeCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
    'no-reply': 0,
  }
  const feelingCounts = {}
  reflections.forEach((reflection) => {
    const outcome = reflection.responseOutcome || 'no-reply'
    outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1
    ;(reflection.selfAssessment || []).forEach((tag) => {
      feelingCounts[tag] = (feelingCounts[tag] || 0) + 1
    })
  })
  const topFeelings = Object.entries(feelingCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
  return { outcomeCounts, topFeelings }
}

export default function ScheduleBoard({ drafts = [], reflections = [] }) {
  const scheduledDrafts = useMemo(() => sortBySchedule(drafts), [drafts])
  const stats = useMemo(() => bucketDraftsByStatus(drafts), [drafts])
  const tones = useMemo(() => summarizeToneUsage(drafts), [drafts])
  const lengthAverage = useMemo(() => averageLength(drafts), [drafts])
  const reflectionSummary = useMemo(() => reflectionStats(reflections), [reflections])

  return (
    <div>
      <div className="card">
        <h2>Planning & rhythm</h2>
        <p>
          A quick snapshot of upcoming drafts and how your outreach rhythm is landing. Use it to pace
          messages and notice what feels best for you both.
        </p>
        {scheduledDrafts.length === 0 ? (
          <div className="empty-state">No drafts scheduled yet.</div>
        ) : (
          <div className="timeline">
            {scheduledDrafts.map((draft) => (
              <div key={draft.id} className="timeline-item">
                <div className="flex-between">
                  <h4>{draft.openerType}</h4>
                  <span className={`badge ${draft.ethics?.grade?.toLowerCase() || 'green'}`}>
                    {draft.ethics?.grade || 'Green'}
                  </span>
                </div>
                <p>{draft.text}</p>
                <div className="counter-row" style={{ marginTop: '0.5rem' }}>
                  <span>{formatSendWindow(draft.sendWindow)}</span>
                  <span>{draft.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Cadence stats</h3>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="small-label">Avg. length</span>
            <strong>{lengthAverage || 0}</strong>
            <span style={{ fontSize: '0.8rem' }}>characters</span>
          </div>
          <div className="stat-card">
            <span className="small-label">Ready drafts</span>
            <strong>{(stats.ready || []).length}</strong>
          </div>
          <div className="stat-card">
            <span className="small-label">Revised drafts</span>
            <strong>{(stats.revised || []).length}</strong>
          </div>
          <div className="stat-card">
            <span className="small-label">New drafts</span>
            <strong>{(stats.new || []).length}</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Tone mix</h3>
        <div className="stat-grid">
          {Object.entries(tones).map(([tone, count]) => (
            <div key={tone} className="stat-card">
              <span className="small-label">{tone}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Reflection highlights</h3>
        {reflections.length === 0 ? (
          <div className="empty-state">Log reflections after you send to build insights.</div>
        ) : (
          <div className="layout-grid">
            <div>
              <h4>Outcomes</h4>
              <ul className="ethics-notes">
                {Object.entries(reflectionSummary.outcomeCounts).map(([outcome, count]) => (
                  <li key={outcome}>
                    {outcome}: {count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>How it felt</h4>
              <ul className="ethics-notes">
                {reflectionSummary.topFeelings.map(([feeling, count]) => (
                  <li key={feeling}>
                    {feeling}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
