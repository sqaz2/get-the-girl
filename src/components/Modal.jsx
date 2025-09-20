export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button type="button" className="ghost" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div>{children}</div>
        {footer ? <div style={{ marginTop: '1rem' }}>{footer}</div> : null}
      </div>
    </div>
  )
}
