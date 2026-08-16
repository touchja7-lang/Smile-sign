import { statusConfig } from '../data/mockData'

export default function OrderStatusBadge({ statusKey }) {
  const config = statusConfig[statusKey] || { label: statusKey, color: 'var(--ink)', bg: 'var(--surface-2)' }
  
  return (
    <span 
      className="impeccable-badge" 
      style={{ 
        color: config.color, 
        backgroundColor: 'transparent',
        border: `1px solid ${config.color}40`, // 40 hex opacity = ~25%
        padding: '2px 8px',
        borderRadius: 'var(--r-sm)',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em'
      }}
    >
      {config.label}
    </span>
  )
}
