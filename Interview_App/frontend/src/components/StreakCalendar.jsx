import { getActivityLog, computeDailyStreakDays } from "../utils/badges";

// ── Streak Calendar Modal ────────────────────────────────────────
// Shows last 35 days as a GitHub-style heatmap
export default function StreakCalendar({ onClose }) {
  const log = getActivityLog();
  const dailyStreak = computeDailyStreakDays();

  // Build last 35 days grid (5 weeks × 7 days)
  const days = [];
  const today = new Date();
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = log[key] || 0;
    days.push({ key, date: d, count });
  }

  const totalActive = Object.keys(log).length;
  const totalAnswered = Object.values(log).reduce((a, b) => a + b, 0);

  // Color based on activity count
  const getColor = (count) => {
    if (count === 0) return "var(--day-empty)";
    if (count <= 2)  return "var(--day-low)";
    if (count <= 5)  return "var(--day-mid)";
    return "var(--day-high)";
  };

  // Day labels
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card streak-calendar-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 Practice Streak</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Stats row */}
        <div className="streak-stats">
          <div className="streak-stat">
            <span className="streak-stat-val">{dailyStreak}</span>
            <span className="streak-stat-label">🔥 Day Streak</span>
          </div>
          <div className="streak-stat">
            <span className="streak-stat-val">{totalActive}</span>
            <span className="streak-stat-label">📅 Active Days</span>
          </div>
          <div className="streak-stat">
            <span className="streak-stat-val">{totalAnswered}</span>
            <span className="streak-stat-label">✅ Answered</span>
          </div>
        </div>

        {/* Day letter headers */}
        <div className="cal-day-labels">
          {DAY_LABELS.map(d => (
            <span key={d} className="cal-day-letter">{d[0]}</span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="cal-grid">
          {days.map(({ key, date, count }) => (
            <div
              key={key}
              className={`cal-cell ${count > 0 ? "active" : ""} ${key === today.toISOString().slice(0, 10) ? "today" : ""}`}
              style={{ background: getColor(count) }}
              title={`${key}: ${count} question${count !== 1 ? "s" : ""}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="cal-legend">
          <span className="cal-legend-label">Less</span>
          {[0, 1, 3, 6].map(n => (
            <div key={n} className="cal-legend-dot" style={{ background: getColor(n) }} />
          ))}
          <span className="cal-legend-label">More</span>
        </div>

        {/* Motivational tip */}
        <p className="streak-tip">
          {dailyStreak === 0
            ? "🌱 Start your streak today — answer just one question!"
            : dailyStreak < 3
            ? `✨ ${dailyStreak}-day streak! Keep going — consistency is everything.`
            : dailyStreak < 7
            ? `🔥 ${dailyStreak} days strong! You're building a real habit.`
            : `🏆 ${dailyStreak}-day streak! You're in the top tier of learners!`}
        </p>
      </div>
    </div>
  );
}
