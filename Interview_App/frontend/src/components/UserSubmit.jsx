import React, { useState } from "react";
import { submitUserQuestion, submitUserComment } from "../api";

export default function UserSubmit({ questionId, defaultMode = "question", onClose }) {
  const [mode, setMode] = useState(defaultMode); // "question" | "comment"
  const [form, setForm] = useState({
    questionText: "",
    category: "Java",
    difficulty: "Medium",
    type: "TEXT",
    options: "",
    referenceAnswer: "",
    commentText: "",
  });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      let resp;
      if (mode === "question") {
        resp = await submitUserQuestion({
          questionText: form.questionText,
          category: form.category,
          difficulty: form.difficulty,
          type: form.type,
          options: form.type === "MCQ" ? form.options : null,
          referenceAnswer: form.referenceAnswer,
        });
      } else {
        resp = await submitUserComment({
          questionId,
          commentText: form.commentText,
        });
      }
      setMessage(resp.message || "Submitted successfully!");
      setStatus("success");
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setMessage("Submission failed. Please try again.");
      setStatus("error");
    }
  };

  const categories = ["Java", "Spring Boot", "Kafka", "SQL", "System Design", "LLD", "DSA", "HR", "General"];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="submit-modal glass-neo" role="dialog" aria-modal="true">
        <div className="submit-modal-header">
          <h2>🙌 Contribute</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tab switcher */}
        <div className="submit-tabs">
          <button
            className={mode === "question" ? "active" : ""}
            onClick={() => setMode("question")}
          >
            📝 Submit Question
          </button>
          {questionId && (
            <button
              className={mode === "comment" ? "active" : ""}
              onClick={() => setMode("comment")}
            >
              💬 Add Comment
            </button>
          )}
        </div>

        {status === "success" ? (
          <div className="submit-success">
            <div className="success-icon">✅</div>
            <p>{message}</p>
            <small>Admin will review and approve shortly.</small>
          </div>
        ) : (
          <div className="submit-form">
            {mode === "question" ? (
              <>
                <textarea
                  className="submit-input"
                  name="questionText"
                  placeholder="Your question text..."
                  value={form.questionText}
                  onChange={handleChange}
                  rows={3}
                />

                <div className="submit-row">
                  <select className="submit-select" name="category" value={form.category} onChange={handleChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="submit-select" name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <select className="submit-select" name="type" value={form.type} onChange={handleChange}>
                    <option value="TEXT">Text</option>
                    <option value="MCQ">MCQ</option>
                    <option value="CODE">Code</option>
                    <option value="BUG">Bug</option>
                  </select>
                </div>

                {form.type === "MCQ" && (
                  <input
                    className="submit-input"
                    name="options"
                    placeholder="MCQ options: A, B, C, D (comma separated)"
                    value={form.options}
                    onChange={handleChange}
                  />
                )}

                <textarea
                  className="submit-input"
                  name="referenceAnswer"
                  placeholder="Reference / ideal answer..."
                  value={form.referenceAnswer}
                  onChange={handleChange}
                  rows={2}
                />
              </>
            ) : (
              <textarea
                className="submit-input"
                name="commentText"
                placeholder="Your insight or tip about this question..."
                value={form.commentText}
                onChange={handleChange}
                rows={4}
              />
            )}

            {status === "error" && <p className="submit-error">⚠️ {message}</p>}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Submitting..." : "🚀 Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
