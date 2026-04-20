import React, { useEffect, useState } from "react";
import { fetchLeaderboard, getVisitorId } from "../api";

function Leaderboard({ onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const myIdPrefix = getVisitorId().substring(0, 8);

  useEffect(() => {
    fetchLeaderboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="modal-overlay glass-modal">
      <div className="modal-content leaderboard-card">
        <div className="modal-header">
          <h2 className="title-gradient">🏆 Hall of Fame</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {loading ? (
          <div className="loader-center">Shifting pixels...</div>
        ) : (
          <div className="leaderboard-list">
            <div className="lb-header">
              <span>Rank</span>
              <span>Innocent Human</span>
              <span>XP</span>
              <span>Streak</span>
            </div>
            {data.map((user, idx) => (
              <div 
                key={idx} 
                className={`lb-row ${user.visitorId.startsWith(myIdPrefix) ? "lb-me" : ""}`}
              >
                <span className="lb-rank">#{idx + 1}</span>
                <span className="lb-name">Human_{user.visitorId.substring(0,6)}</span>
                <span className="lb-xp">{user.xp}</span>
                <span className="lb-streak">{user.streak}🔥</span>
              </div>
            ))}
          </div>
        )}

        <div className="lb-footer">
          <p>Compete with anonymous humans globally</p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
