import { useEffect } from 'react';

const ICONS = { success: '✓', error: '✕', info: 'ℹ' };

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fermer">×</button>
    </div>
  );
}
