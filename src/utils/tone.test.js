import { describe, it, expect } from 'vitest'
import { applyTonePreset, applyToneCooldown, applyVulnerabilityLevel, applySeductiveMode } from './tone'

describe('tone helpers', () => {
  it('adds warm opener and closer', () => {
    const text = applyTonePreset('Appreciate your insight.', 'warm')
    expect(text.toLowerCase()).toContain('hey there')
    expect(text.toLowerCase()).toContain('gentle pockets of ease')
  })

  it('cools intense language', () => {
    const text = applyToneCooldown('I need an answer now!!')
    expect(text).not.toMatch(/need/i)
    expect(text).not.toContain('!!')
  })

  it('applies vulnerability level', () => {
    const high = applyVulnerabilityLevel('Thanks for meeting up.', 'high')
    expect(high.toLowerCase()).toContain('honesty check')
  })

  it('reinforces boundaries in seductive mode', () => {
    const text = applySeductiveMode('You have such captivating energy.')
    expect(text.toLowerCase()).toContain('no rush or pressure')
    expect(text.toLowerCase()).not.toContain('sexy')
  })
})
