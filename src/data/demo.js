import { starterSeedData } from './starters'

export const demoIntake = {
  contextNote: 'Met at the creativity retreat two weeks ago after the enneagram breakout session.',
  valuesList: ['Depth', 'Authenticity', 'Play', 'Steadiness', 'Curiosity'],
  boundaries: ['No late-night messages', 'Lead with consent', 'Keep it grounded'],
  intentions: ['Reach out with warmth and zero pressure'],
  toneDefaults: ['warm', 'curious'],
  intentStatement: 'Reconnect with honesty, honor her pace, and stay grounded in respect.',
}

export const demoDrafts = [
  {
    id: 'demo-draft-1',
    uid: 'demo',
    text: "Hey [Name], that reflection you shared about slowing Sunday mornings has been stuck in my head—in the best way. It nudged me to pause this week. Hope your evening has some ease in it.",
    tone: ['warm', 'sincere'],
    openerType: 'reconnect',
    targetChannel: 'Messenger',
    sendWindow: { dayOfWeek: 'Wednesday', timeLocal: '18:30' },
    status: 'ready',
    ethics: {
      grade: 'Green',
      notes: ['Grounded, curious, and spacious.'],
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'demo-draft-2',
    uid: 'demo',
    text: 'Hi [Name], I found a piece on intuitive leadership and it sparked our convo—wondering how that theme is landing for you lately? No rush, just a curious ENTP brain checking in.',
    tone: ['curious'],
    openerType: 'followup',
    targetChannel: 'Messenger',
    sendWindow: { dayOfWeek: 'Friday', timeLocal: '19:00' },
    status: 'revised',
    ethics: {
      grade: 'Yellow',
      notes: ['Consider adding appreciation to ground it.'],
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
]

export const demoReflections = [
  {
    id: 'demo-ref-1',
    uid: 'demo',
    sentCopy:
      "Sent the gratitude note about her calm energy. Felt grounded and calm hitting send.",
    dateSent: new Date().toISOString().split('T')[0],
    responseOutcome: 'positive',
    selfAssessment: ['felt grounded', 'kept it light'],
    nextStep: 'Give it a few days before the next touch point. Keep tone steady.',
  },
]

export function buildDemoStarters() {
  return starterSeedData().map((starter) => ({
    ...starter,
    uid: 'demo',
    preview: starter.preview.replace('[Name]', 'there'),
  }))
}
