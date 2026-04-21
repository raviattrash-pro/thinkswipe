import { useState } from "react";
import { BADGES, RARITY_COLOR, getEarnedBadges } from "../utils/badges";

// ── Unlock Celebration Modal ────────────────────────────────────
export function BadgeUnlockModal({ badges, onClose }) {
  const [idx, setIdx] = useState(0);
  if (!badges || badges.length === 0) return null;

  const badge = badges[idx];
  const colors = RARITY_COLOR[badge.rarity];
  const isLast = idx === badges.length - 1;

  const advance = () => {
    if (isLast) onClose();
    else setIdx(i => i + 1);
  };

  return (
    <div className="badge-unlock-overlay" onClick={advance}>
      <div
        className="badge-unlock-card"
        style={{
          borderColor: colors.border,
          boxShadow: `0 0 60px ${colors.glow}, 0 20px 60px rgba(0,0,0,0.6)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti particles */}
        <div className="badge-confetti" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="confetti-dot"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.6}s`,
                background: [colors.label, "#fe2c55", "#25f4ee", "#ffc107", "#fff"][i % 5],
              }}
            />
          ))}
        </div>

        <p className="badge-unlock-label" style={{ color: colors.label }}>
          🎉 Badge Unlocked!
        </p>

        <div
          className="badge-icon-ring"
          style={{ borderColor: colors.border, background: colors.bg, boxShadow: `0 0 40px ${colors.glow}` }}
        >
          <span>{badge.icon}</span>
        </div>

        <p className="badge-rarity-tag" style={{ color: colors.label }}>{badge.rarity.toUpperCase()}</p>
        <h2 className="badge-name">{badge.name}</h2>
        <p className="badge-desc">{badge.desc}</p>

        {badges.length > 1 && (
          <p className="badge-more-hint">{badges.length - idx - 1} more badge{badges.length - idx - 1 !== 1 ? "s" : ""} unlocked!</p>
        )}

        <button className="badge-continue-btn" style={{ borderColor: colors.border, color: colors.label }} onClick={advance}>
          {isLast ? "Awesome! 💪" : "Next Badge →"}
        </button>
      </div>
    </div>
  );
}

// ── Badge Showcase Panel (all badges grid) ──────────────────────
export function BadgeShowcase({ onClose }) {
  const earned = getEarnedBadges();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card badge-showcase" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏅 Your Badges</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="badge-showcase-count">
          {earned.length} / {BADGES.length} unlocked
        </p>

        {/* Progress bar */}
        <div className="badge-progress-bar">
          <div
            className="badge-progress-fill"
            style={{ width: `${(earned.length / BADGES.length) * 100}%` }}
          />
        </div>

        <div className="badge-grid">
          {BADGES.map(badge => {
            const isEarned = earned.includes(badge.id);
            const colors = RARITY_COLOR[badge.rarity];
            return (
              <div
                key={badge.id}
                className={`badge-grid-item ${isEarned ? "earned" : "locked"}`}
                style={isEarned ? {
                  borderColor: colors.border,
                  background: colors.bg,
                  boxShadow: `0 0 12px ${colors.glow}`,
                } : {}}
                title={isEarned ? badge.desc : "???"}
              >
                <span className="badge-grid-icon">{isEarned ? badge.icon : "🔒"}</span>
                <span className="badge-grid-name" style={isEarned ? { color: colors.label } : {}}>
                  {isEarned ? badge.name : "Locked"}
                </span>
                {isEarned && (
                  <span className="badge-grid-rarity" style={{ color: colors.label }}>
                    {badge.rarity}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
