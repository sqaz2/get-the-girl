const redPatterns = [
  {
    pattern: /(if you|unless you).*respond/i,
    note: 'Avoid implying she owes you a response or setting ultimatums.',
  },
  {
    pattern: /(or else|last chance|before it\'s too late)/i,
    note: 'Remove scarcity or pressure tactics.',
  },
  {
    pattern: /(you owe me|i deserve|i expect you to)/i,
    note: 'Drop entitlement and invite dialogue instead.',
  },
  {
    pattern: /(hot pics|sexy pics|nsfw|spicy photo)/i,
    note: 'Respect boundaries—no sexual innuendo.',
  },
  {
    pattern: /(neg|not like other girls|you\'re better than)/i,
    note: 'No negging—keep compliments grounded and genuine.',
  },
]

const yellowPatterns = [
  {
    pattern: /(can\'t stop thinking about you|obsessed with)/i,
    note: 'Dial back intensity; keep interest steady without overwhelm.',
  },
  {
    pattern: /(blow up your phone|message you again and again)/i,
    note: 'Space your outreach—give her room to breathe.',
  },
  {
    pattern: /(maybe i\'m crazy|don\'t ghost me)/i,
    note: 'Reframe insecurity into grounded curiosity.',
  },
  {
    pattern: /(prove that you care|make it up to me)/i,
    note: 'Invite, don\'t demand. Shift to collaborative language.',
  },
  {
    pattern: /(soulmate|meant to be forever|perfect woman)/i,
    note: 'Too heavy too soon—aim for sincere but proportionate affection.',
  },
]

const seductiveModeYellow = [
  {
    pattern: /(can\'t resist your body|you\'re so hot)/i,
    note: 'Keep focus on connection and respect—skip body commentary.',
  },
]

const softSuggestions = [
  {
    pattern: /(sometime|maybe|whenever)/i,
    suggestion: 'Add a specific but flexible window, e.g., “later this week if it fits for you.”',
  },
  {
    pattern: /(we should|we need to)/i,
    suggestion: 'Try asking with “Would you be open to…” to keep agency shared.',
  },
  {
    pattern: /(i\'ll change your mind|trust me)/i,
    suggestion: 'Invite her perspective instead of persuading.',
  },
]

export function analyzeDraft(text = '', { seductiveMode = false } = {}) {
  const clean = text.trim()
  if (!clean) {
    return {
      grade: 'Green',
      notes: ['Start crafting a message that centers curiosity and respect.'],
      suggestions: [],
    }
  }

  const lower = clean.toLowerCase()
  let grade = 'Green'
  const notes = []

  const scan = (patterns, severity) => {
    patterns.forEach((item) => {
      if (item.pattern.test(lower)) {
        notes.push(item.note)
        if (severity === 'red') {
          grade = 'Red'
        } else if (grade !== 'Red') {
          grade = 'Yellow'
        }
      }
    })
  }

  scan(redPatterns, 'red')
  scan(yellowPatterns, 'yellow')
  if (seductiveMode) {
    scan(seductiveModeYellow, 'yellow')
    if (!/no rush|no pressure|totally okay/i.test(lower)) {
      notes.push('In “Seductive, Not Sleazy” mode add an explicit “No rush or pressure.” line.')
      if (grade !== 'Red') grade = 'Yellow'
    }
  }

  if (/(!!!|!\?|\?\?)/.test(clean)) {
    notes.push('Tone down multiple exclamation/question marks—keep it steady and calm.')
    if (grade !== 'Red') grade = 'Yellow'
  }

  if (clean.length > 650) {
    notes.push('Consider trimming length; INFJs appreciate space to process shorter notes first.')
    if (grade !== 'Red') grade = 'Yellow'
  }

  const suggestions = softSuggestions
    .filter((item) => item.pattern.test(lower))
    .map((item) => item.suggestion)

  if (!/open-ended question|\?/i.test(clean)) {
    suggestions.push('Invite her perspective with an open question that honors her tempo.')
  }

  if (!/thank|appreciate|grateful/i.test(lower)) {
    suggestions.push('Ground the draft with a concise appreciation or insight.')
  }

  if (grade === 'Green' && notes.length === 0) {
    notes.push('Looks thoughtful and steady. Give it one more read aloud for tone.')
  }

  return { grade, notes, suggestions }
}

export function combineEthicsAndOverride(analysis, overrideNote) {
  if (analysis.grade !== 'Red') return analysis
  const merged = { ...analysis }
  if (overrideNote?.trim()) {
    merged.notes = [
      'Override rationale recorded: ' + overrideNote.trim(),
      ...analysis.notes,
    ]
  }
  return merged
}

export function ethicsColor(grade) {
  if (grade === 'Red') return 'red'
  if (grade === 'Yellow') return 'yellow'
  return 'green'
}

export const ETHICS_PATTERNS = {
  red: redPatterns,
  yellow: yellowPatterns,
  seductiveModeYellow,
  softSuggestions,
}
