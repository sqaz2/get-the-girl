export const DEFAULT_SLIDERS = {
  formality: 55,
  playfulness: 45,
  vulnerability: 55,
  length: 50,
}

const STARTER_TEMPLATES = [
  {
    id: 'reconnect-program',
    category: 'Reconnection',
    title: 'Program callback',
    description: 'Gentle reconnection that nods to a shared program moment.',
    template:
      "{{greeting}} [Name], I've been thinking about that [shared moment] from the program—{{vulnerability}} {{playfulness}} {{length}}",
    tags: ['warm', 'sincere'],
    replacements: {
      greeting: {
        low: 'Hey',
        medium: 'Hi',
        high: 'Hello',
      },
      vulnerability: {
        low: 'it was just good to run into you again.',
        medium: 'it honestly grounded my week in the best way.',
        high: 'it genuinely shifted how I carried the rest of that week.',
      },
      playfulness: {
        low: 'Been keeping it simple on my end.',
        medium: 'It still makes me grin when I think about it.',
        high: 'My ENTP brain keeps riffing on it.',
      },
      length: {
        short: 'Hope your week is treating you kindly.',
        medium: 'Hope the week is easing in gently—curious how things are landing for you.',
        long: 'If you feel like sharing, I would love to hear how your week is unfolding when it fits for you.',
      },
    },
  },
  {
    id: 'shared-sensory',
    category: 'Shared Moment Callback',
    title: 'Sensory callback',
    description: 'Draws back to a sensory detail INFJs tend to cherish.',
    template:
      "{{greeting}} [Name], that detail you mentioned about [shared sensory cue] stuck with me—{{vulnerability}} {{playfulness}} {{length}}",
    tags: ['curious', 'warm'],
    replacements: {
      greeting: {
        low: 'Hey again',
        medium: 'Hi there',
        high: 'Hello again',
      },
      vulnerability: {
        low: 'it felt grounding to hear you describe it.',
        medium: 'it reminded me to slow down and notice the subtleties too.',
        high: 'it honestly tugged at something I didn\'t know I needed to hear.',
      },
      playfulness: {
        low: 'I keep thinking about it in the best way.',
        medium: 'It keeps nudging my imagination.',
        high: 'My mind keeps painting that scene like a mini-film.',
      },
      length: {
        short: 'Hope your evening has some ease in it.',
        medium: 'If you feel like swapping perspectives sometime, I\'m here.',
        long: 'Whenever you\'re up for trading notes again, I\'d enjoy hearing more about it.',
      },
    },
  },
  {
    id: 'thoughtful-question-perspective',
    category: 'Thoughtful Question',
    title: 'Perspective follow-up',
    description: 'Checks back in on a thoughtful thread she opened.',
    template:
      "{{greeting}} [Name], you mentioned [topic] and I found a short piece on it—it made me think of your perspective. {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['curious', 'sincere'],
    replacements: {
      greeting: {
        low: 'Hey',
        medium: 'Hi',
        high: 'Hello',
      },
      playfulness: {
        low: 'It quietly stuck with me.',
        medium: 'It made me smile thinking about your angle.',
        high: 'It turned into a mini rabbit hole in my head.',
      },
      vulnerability: {
        low: 'Curious how you\'re seeing it these days.',
        medium: 'I\'d love to hear where your head is with it now.',
        high: 'Genuinely want to hear how it lands in your world now.',
      },
      length: {
        short: 'If sharing doesn\'t fit, totally okay.',
        medium: 'Open to trading notes when it fits for you?',
        long: 'If you ever want to geek out about it again, I\'m very here for that conversation.',
      },
    },
  },
  {
    id: 'thoughtful-question-values',
    category: 'Thoughtful Question',
    title: 'Values reflection',
    description: 'Invites her to share how a value is showing up lately.',
    template:
      "{{greeting}} [Name], I remembered you naming [value] as a compass. {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['sincere', 'warm'],
    replacements: {
      greeting: {
        low: 'Hi again',
        medium: 'Hey there',
        high: 'Hello there',
      },
      playfulness: {
        low: 'It nudged me to check in on my own priorities.',
        medium: 'It got me journaling about what\'s anchoring me lately.',
        high: 'It sent me on a mini self-inventory spiral (the good kind).',
      },
      vulnerability: {
        low: 'How has [value] been showing up for you?',
        medium: 'Curious where [value] is guiding you these days.',
        high: 'Would love to hear how [value] is shaping things if you\'re open to sharing.',
      },
      length: {
        short: 'Sending good energy either way.',
        medium: 'I\'m all ears if/when you feel like reflecting.',
        long: 'Whenever you\'re in the mood for a values chat, I\'m game.',
      },
    },
  },
  {
    id: 'light-invite-coffee',
    category: 'Light Invite',
    title: 'Low-pressure coffee',
    description: 'Invitation with clear opt-out and warmth.',
    template:
      "{{greeting}} [Name], no pressure at all, but if you\'re up for a short coffee this week I\'d enjoy continuing our chat about [topic]. {{vulnerability}} {{length}}",
    tags: ['warm', 'playful'],
    replacements: {
      greeting: {
        low: 'Hey hey',
        medium: 'Hi',
        high: 'Hello',
      },
      vulnerability: {
        low: 'If not, totally okay and I\'ll keep cheering from afar.',
        medium: 'If timing\'s off, zero stress—still grateful for that convo.',
        high: 'If it doesn\'t fit, no worries. I just wanted to name it out loud.',
      },
      length: {
        short: 'Either way, wishing you a smooth week.',
        medium: 'Happy to work around your pace if it sounds fun to you.',
        long: 'If a different rhythm suits better, I\'m open to that too.',
      },
      playfulness: {
        low: 'Keeping it casual.',
        medium: 'Consider it an easy-going field trip.',
        high: 'Promise to bring conversational snacks, not pressure.',
      },
    },
  },
  {
    id: 'light-invite-experience',
    category: 'Light Invite',
    title: 'Experience share',
    description: 'Suggests a shared experience anchored in her interests.',
    template:
      "{{greeting}} [Name], a mini [experience] popped up this week and I thought of your take. {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['curious', 'playful'],
    replacements: {
      greeting: {
        low: 'Hiya',
        medium: 'Hey there',
        high: 'Hello there',
      },
      playfulness: {
        low: 'It seemed like your kind of reflective space.',
        medium: 'It felt like the exact vibe you described enjoying.',
        high: 'It felt like an INFJ-approved pocket of wonder.',
      },
      vulnerability: {
        low: 'Open to a gentle wander through it sometime?',
        medium: 'If sharing that space appeals, I\'d enjoy tagging along.',
        high: 'Would you be into co-exploring it when it suits you?',
      },
      length: {
        short: 'If not your scene, no worries at all.',
        medium: 'Happy to keep the idea in the wings until it fits.',
        long: 'Or feel free to tuck it away and call it in later—no rush.',
      },
    },
  },
  {
    id: 'gratitude-presence',
    category: 'Gratitude/Admiration',
    title: 'Calm presence thanks',
    description: 'Acknowledges her grounding energy with sincerity.',
    template:
      "{{greeting}} [Name], I appreciated your calm energy during [situation]. {{vulnerability}} {{playfulness}} {{length}}",
    tags: ['sincere', 'warm'],
    replacements: {
      greeting: {
        low: 'Hey',
        medium: 'Hi',
        high: 'Hello',
      },
      vulnerability: {
        low: 'It helped me slow down and stay present.',
        medium: 'It let me exhale in a week that was otherwise hectic.',
        high: 'It genuinely recalibrated me in a way I didn\'t expect.',
      },
      playfulness: {
        low: 'Thanks for that.',
        medium: 'Thanks for lending that steadiness.',
        high: 'Thanks for being the calm in the ENTP storm.',
      },
      length: {
        short: 'Hope you\'re getting that same ease back.',
        medium: 'Curious what\'s been grounding you lately.',
        long: 'If you ever want to swap grounding rituals, I\'m listening.',
      },
    },
  },
  {
    id: 'gratitude-mindful',
    category: 'Gratitude/Admiration',
    title: 'Mindful mirror',
    description: 'Reflects how her insight nudged your own growth.',
    template:
      "{{greeting}} [Name], your insight about [insight] lingered with me. {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['sincere'],
    replacements: {
      greeting: {
        low: 'Hi',
        medium: 'Hey again',
        high: 'Hello again',
      },
      playfulness: {
        low: 'It nudged me into a mini reflection session.',
        medium: 'It sparked a journaling rabbit hole (the useful kind).',
        high: 'It set my neurons on a thoughtful detour.',
      },
      vulnerability: {
        low: 'Thanks for sharing it so openly.',
        medium: 'It reminded me why I value grounded conversations.',
        high: 'It genuinely mattered to hear that in your voice.',
      },
      length: {
        short: 'Hope today has a moment that feels just as centering for you.',
        medium: 'Would love to know what else has been on your mind lately.',
        long: 'Whenever you want to unpack more of that, I\'m all ears.',
      },
    },
  },
  {
    id: 'playful-toast',
    category: 'Playful but Respectful',
    title: 'Lightly toasted callback',
    description: 'Balances wit with respect and clear boundaries.',
    template:
      "{{greeting}} [Name], I still owe you a better answer to your take on [topic]. I\'ve upgraded from “half-baked” to “lightly toasted.” {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['playful'],
    replacements: {
      greeting: {
        low: 'Hey',
        medium: 'Hi',
        high: 'Hello',
      },
      playfulness: {
        low: 'Ready for the taste test when you are.',
        medium: 'My brain has been slow-roasting a reply.',
        high: 'Promise it\'s artisan-level banter now.',
      },
      vulnerability: {
        low: 'Curious if you\'re still up for trading thoughts sometime.',
        medium: 'Want to trade thoughts sometime soon?',
        high: 'Would love to riff with you when it feels good to you.',
      },
      length: {
        short: 'No pressure whatsoever.',
        medium: 'Let me know if and when your curiosity sparks.',
        long: 'If it\'s not the vibe, I\'m still glad that conversation happened.',
      },
    },
  },
  {
    id: 'pacing-respect',
    category: 'Gratitude/Admiration',
    title: 'Pace respect',
    description: 'Names her tempo and offers mutual pacing.',
    template:
      "{{greeting}} [Name], I respect how thoughtfully you pace things. {{vulnerability}} {{playfulness}} {{length}}",
    tags: ['warm', 'sincere'],
    replacements: {
      greeting: {
        low: 'Hi',
        medium: 'Hey',
        high: 'Hello',
      },
      vulnerability: {
        low: 'It reminded me to slow my own roll.',
        medium: 'It actually helps my Type 8 side breathe.',
        high: 'It makes me want to match that care in how I show up.',
      },
      playfulness: {
        low: 'Thanks for the gentle pacing lesson.',
        medium: 'Thanks for that unintentional masterclass.',
        high: 'Consider me a student of your pacing philosophy now.',
      },
      length: {
        short: 'Hope your week gives that same space back to you.',
        medium: 'If you ever want to swap pacing strategies, I\'m listening.',
        long: 'Happy to build connection at whatever tempo feels honoring to you.',
      },
    },
  },
  {
    id: 'creative-callback',
    category: 'Shared Moment Callback',
    title: 'Creative echo',
    description: 'Invites collaborative creativity anchored in her INFJ depth.',
    template:
      "{{greeting}} [Name], your angle on [creative idea] has been echoing in my head. {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['curious', 'playful'],
    replacements: {
      greeting: {
        low: 'Hey again',
        medium: 'Hi there',
        high: 'Hello there',
      },
      playfulness: {
        low: 'It left this cinematic afterglow.',
        medium: 'It keeps resurfacing in my notes app.',
        high: 'It turned into a mini storyboard in my mind.',
      },
      vulnerability: {
        low: 'Want to keep riffing when the mood hits?',
        medium: 'If you ever want to co-create a version of it, I\'m game.',
        high: 'Would love to workshop it with you sometime if that excites you.',
      },
      length: {
        short: 'If you\'re not feeling it, no worries at all.',
        medium: 'Happy to let it simmer until it feels right.',
        long: 'We can keep it in the idea vault until the moment chooses us both.',
      },
    },
  },
  {
    id: 'gentle-checkin',
    category: 'Reconnection',
    title: 'Gentle check-in',
    description: 'Soft pulse check that centers her comfort.',
    template:
      "{{greeting}} [Name], just wanted to send a gentle check-in from my corner. {{playfulness}} {{vulnerability}} {{length}}",
    tags: ['warm'],
    replacements: {
      greeting: {
        low: 'Hey there',
        medium: 'Hi',
        high: 'Hello',
      },
      playfulness: {
        low: 'No agenda attached.',
        medium: 'Just one human waving to another.',
        high: 'Consider it a calm ENTP head nod.',
      },
      vulnerability: {
        low: 'How\'s your week landing?',
        medium: 'Anything bringing you joy or calm lately?',
        high: 'What\'s been nourishing your energy these days?',
      },
      length: {
        short: 'Sending respect for whatever pace feels right.',
        medium: 'Here if sharing ever feels good.',
        long: 'If you feel like swapping stories soon or later, I\'m game.',
      },
    },
  },
]

function levelFromValue(value = 50) {
  if (value < 34) return 'low'
  if (value < 67) return 'medium'
  return 'high'
}

function lengthFromValue(value = 50) {
  if (value < 34) return 'short'
  if (value < 67) return 'medium'
  return 'long'
}

export function buildStarterPreview(template, sliders = DEFAULT_SLIDERS) {
  const formalityLevel = levelFromValue(sliders.formality)
  const playfulnessLevel = levelFromValue(sliders.playfulness)
  const vulnerabilityLevel = levelFromValue(sliders.vulnerability)
  const lengthLevel = lengthFromValue(sliders.length)

  let text = template.template
  const replacements = template.replacements || {}

  const map = {
    greeting: replacements.greeting?.[formalityLevel],
    playfulness: replacements.playfulness?.[playfulnessLevel],
    vulnerability: replacements.vulnerability?.[vulnerabilityLevel],
    length: replacements.length?.[lengthLevel],
  }

  Object.entries(map).forEach(([key, value]) => {
    text = text.replace(`{{${key}}}`, value || '')
  })

  return text.replace(/\s+/g, ' ').replace(/ \./g, '.').trim()
}

export function starterSeedData() {
  return STARTER_TEMPLATES.map((template) => ({
    ...template,
    sliders: { ...DEFAULT_SLIDERS },
    preview: buildStarterPreview(template, DEFAULT_SLIDERS),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }))
}

export { STARTER_TEMPLATES }
