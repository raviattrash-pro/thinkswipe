import React, { useState, useEffect, useRef } from "react";
import { fetchDailyChallenge, submitAnswer, updateLeaderboardProgress } from "../api";

function DailyChallenge({ onClose }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchDailyChallenge().then(setQuestion);
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await submitAnswer({ questionId: question.id, userAnswer: answer });
      setResult(res);
      await updateLeaderboardProgress(res.score);
    } catch (e) {
      alert("Failed to submit challenge.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateShareCard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 400, 600);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);

    // Draw Score
    ctx.fillStyle = "#fff";
    ctx.font = "bold 80px Inter";
    ctx.textAlign = "center";
    ctx.fillText(result.score, 200, 150);
    ctx.font = "20px Inter";
    ctx.fillText("DAILY CHALLENGE SCORE", 200, 180);

    // Draw Question Title (wrapped)
    ctx.font = "bold 24px Inter";
    const words = question.title.split(' ');
    let line = '';
    let y = 300;
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > 340 && n > 0) {
        ctx.fillText(line, 200, y);
        line = words[n] + ' ';
        y += 30;
      } else { line = testLine; }
    }
    ctx.fillText(line, 200, y);

    // Draw Branding
    ctx.font = "italic bold 32px Inter";
    ctx.fillText("#ThinkSwipe", 200, 550);

    // Share or download
    canvas.toBlob((blob) => {
      const file = new File([blob], "thinkswipe_daily.png", { type: "image/png" });
      if (navigator.share) {
        navigator.share({
          files: [file],
          title: "My ThinkSwipe Daily Challenge Result",
          text: `I scored ${result.score}/10 on today's #ThinkSwipe challenge! Can you beat me?`
        }).catch(() => {});
      } else {
        const link = document.createElement('a');
        link.download = 'thinkswipe_daily.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    });
  };

  if (!question) return null;

  return (
    <div className="modal-overlay glass-modal">
      <div className="modal-content challenge-card">
        <div className="modal-header">
          <h2 className="title-gradient">🌟 Daily Challenge</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {!result ? (
          <div className="challenge-body">
            <p className="challenge-meta">{question.category} • {question.difficulty}</p>
            <h3 className="challenge-title">{question.title}</h3>
            <textarea
              className="glass-input answer-box"
              placeholder="Type your elite answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button 
              className="action-btn submit-btn" 
              disabled={submitting} 
              onClick={handleSubmit}
            >
              {submitting ? "Evaluating..." : "Submit Answer"}
            </button>
          </div>
        ) : (
          <div className="challenge-result">
            <div className="score-circle">
              <span className="score-val">{result.score}</span>
            </div>
            <p className="challenge-feedback">"{result.feedback}"</p>
            
            <div className="result-comp-small" style={{ margin: "15px 0", textAlign: "left", fontSize: "0.8rem", color: "#1a1a2e" }}>
               <p><b>Ideal Answer:</b> <br/> {result.referenceAnswer}</p>
            </div>
            <button className="action-btn share-btn" onClick={generateShareCard}>
              Share Result #ThinkSwipe
            </button>
            <canvas ref={canvasRef} width="400" height="600" style={{ display: "none" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyChallenge;
