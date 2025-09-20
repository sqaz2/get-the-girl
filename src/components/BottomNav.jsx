const NAV_ITEMS = [
  { key: 'starters', label: 'Starters', icon: '🌱' },
  { key: 'compose', label: 'Compose', icon: '✍️' },
  { key: 'schedule', label: 'Schedule', icon: '🗓️' },
  { key: 'reflections', label: 'Reflections', icon: '🧭' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={item.key === active ? 'active' : ''}
          onClick={() => onChange(item.key)}
        >
          <span role="img" aria-label={item.label} style={{ fontSize: '1.1rem', display: 'block' }}>
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
