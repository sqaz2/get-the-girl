import { describe, it, expect } from 'vitest'
import { analyzeDraft } from './ethics'

describe('analyzeDraft', () => {
  it('returns green for grounded text', () => {
    const result = analyzeDraft('Hi there, thanks again for sharing your calm energy. Curious how your week is?')
    expect(result.grade).toBe('Green')
    expect(result.notes.length).toBeGreaterThan(0)
  })

  it('flags manipulative language as red', () => {
    const result = analyzeDraft('If you do not reply I will be disappointed—you owe me a response.')
    expect(result.grade).toBe('Red')
  })

  it('requires no-pressure line in seductive mode', () => {
    const result = analyzeDraft('You are so hot, let me convince you to see me soon.', { seductiveMode: true })
    expect(result.grade).toBe('Yellow')
    expect(result.notes.some((note) => note.includes('Seductive, Not Sleazy'))).toBe(true)
  })
})
