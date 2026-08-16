import { ShieldCheck, Target, TrendingUp } from 'lucide-react'
import { sellerLevels } from '../data/mockData'
import './LevelCard.css'

export function LevelCard({ user }) {
  const currentSales = user.currentSales || 0
  const nextLevelTarget = user.nextLevelTarget || 30000

  const currentLvlIdx = sellerLevels.findIndex(l => l.name === (user.sellerLevel || 'Bronze'))
  const currentLvl = currentLvlIdx >= 0 ? sellerLevels[currentLvlIdx] : sellerLevels[0]
  const nextLvl = currentLvlIdx < sellerLevels.length - 1 ? sellerLevels[currentLvlIdx + 1] : null
  
  const isMax = nextLvl === null
  const progress = isMax ? 100 : Math.min((currentSales / nextLevelTarget) * 100, 100)

  return (
    <div className="impeccable-level-card">
      <div className="impeccable-level-card__header">
        <div className="impeccable-level-card__badge-wrap">
          <ShieldCheck size={18} className="text-brand" />
          <span className="font-600 text-sm">Level: {user.sellerLevel || 'Bronze'}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Cost Reduction</p>
          <p className="font-mono font-600 text-brand text-lg">{currentLvl.discount}%</p>
        </div>
      </div>

      <div className="impeccable-level-card__body">
        <div className="flex justify-between items-end" style={{ marginBottom: 'var(--sp-2)' }}>
          <div>
            <p className="text-xs text-muted">Current Volume</p>
            <p className="font-mono font-500">฿{currentSales.toLocaleString()}</p>
          </div>
          {!isMax && (
            <div className="text-right">
              <p className="text-xs text-muted">Target ({nextLvl.name})</p>
              <p className="font-mono font-500">฿{nextLevelTarget.toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="impeccable-progress">
          <div className="impeccable-progress__track">
            <div
              className="impeccable-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Vertical ticks for measurement feel */}
          <div className="impeccable-progress__ticks">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>

        {!isMax && (
          <p className="text-xs text-muted" style={{ marginTop: 'var(--sp-3)', display: 'flex', gap: 4, alignItems: 'center' }}>
            <TrendingUp size={12} />
            <span>Need <span className="font-mono">฿{(nextLevelTarget - currentSales).toLocaleString()}</span> more to unlock {nextLvl.name}</span>
          </p>
        )}
      </div>
    </div>
  )
}
