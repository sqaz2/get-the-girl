const toneClosers = {
  warm: "Hope your week has some gentle pockets of ease.",
  curious: "Curious to hear how that lands for you when it feels right to share.",
  playful: "Consider this a light nudge with a grin—no pressure, promise.",
  sincere: "Sharing this because authenticity matters to me and I value our rapport.",
}

const toneOpeners = {
  warm: "Hey there, sending a little calm your way.",
  curious: "I keep wondering about your take on this.",
  playful: "ENTP brain still sparking over our conversation.",
  sincere: "Wanted to circle back with honesty and respect.",
}

function ensureSentence(text, sentence) {
  if (!sentence) return text
  const normalized = text.toLowerCase()
  if (normalized.includes(sentence.toLowerCase())) return text
  const separator = text.trim().endsWith('.') || text.trim().endsWith('!') ? ' ' : '. '
  return text.trim() + separator + sentence
}

export function applyTonePreset(text, preset, { defaults = [] } = {}) {
  if (!text) return text
  const additions = []
  if (!defaults.includes(preset)) {
    additions.push(toneOpeners[preset])
  }
  additions.push(toneClosers[preset])
  let result = text.trim()
  additions.forEach((line) => {
    if (!line) return
    const normalized = line.toLowerCase()
    if (!result.toLowerCase().includes(normalized)) {
      result = ensureSentence(result, line)
    }
  })
  return result
}

export function applyToneCooldown(text) {
  if (!text) return text
  const replacements = [
    { from: /\bi need\b/gi, to: "I'd like" },
    { from: /\bi want\b/gi, to: "I'm interested in" },
    { from: /\bnow\b/gi, to: 'when it feels right' },
    { from: /!!+/g, to: '!' },
    { from: /\bi can\'t wait\b/gi, to: "I'm looking forward" },
  ]
  let result = text
  replacements.forEach(({ from, to }) => {
    result = result.replace(from, to)
  })
  return result
}

export function applyVulnerabilityLevel(text, level = 'medium') {
  if (!text) return text
  let result = text.trim()
  if (level === 'low') {
    result = ensureSentence(result, 'Keeping it light—only if this feels good for you.')
  }
  if (level === 'medium') {
    result = ensureSentence(result, "I'm sharing because our exchange felt meaningful.")
  }
  if (level === 'high') {
    result = ensureSentence(
      result,
      'Honesty check: I felt a genuine spark in how you see the world and I want to respect that.',
    )
  }
  return result
}

export function applySeductiveMode(text) {
  if (!text) return text
  let result = text.trim()
  result = ensureSentence(result, 'No rush or pressure—your pace matters.')
  result = result.replace(/\b(sexy|hot|irresistible)\b/gi, 'captivating energy')
  return result
}

export function summarizeToneUsage(drafts = []) {
  const counts = { warm: 0, curious: 0, playful: 0, sincere: 0 }
  drafts.forEach((draft) => {
    ;(draft.tone || []).forEach((tone) => {
      if (counts[tone] !== undefined) counts[tone] += 1
    })
  })
  return counts
}

export function averageLength(drafts = []) {
  if (!drafts.length) return 0
  const total = drafts.reduce((sum, draft) => sum + (draft.text?.length || 0), 0)
  return Math.round(total / drafts.length)
}
