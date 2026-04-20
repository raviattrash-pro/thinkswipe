import React, { useState, useEffect } from "react";
import {
  fetchAdminStats, fetchAdminSubmissions, approveSubmission, deleteSubmission,
  fetchAdminComments, approveComment, deleteComment, fetchAdminVisitors,
  fetchAdminAnalyticsQuestions, fetchAdminAnalyticsRetention, fetchAdminAnalyticsFunnel,
  fetchAdminAnalyticsPopular, bulkImportQuestions, adminLogin, adminChangePassword
} from "../api";

export default function AdminPanel({ onExit }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [comments, setComments] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [qAnalytics, setQAnalytics] = useState([]);
  const [popularQs, setPopularQs] = useState([]);
  const [retention, setRetention] = useState(null);
  const [funnel, setFunnel] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [importFile, setImportFile] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async () => {
    try {
      const res = await adminLogin(loginForm.user, loginForm.pass);
      if (res.success) {
        sessionStorage.setItem("admin_auth", "true");
        setAuthed(true);
      }
    } catch (e) {
      setLoginError("Invalid credentials.");
    }
  };

  const [newPassForm, setNewPassForm] = useState({ newPass: "", confirmPass: "" });

  const handlePasswordChange = async () => {
    if (!newPassForm.newPass) return showToast("Password cannot be empty", "error");
    if (newPassForm.newPass !== newPassForm.confirmPass) return showToast("Passwords do not match", "error");
    
    setLoading(true);
    try {
      await adminChangePassword(newPassForm.newPass);
      showToast("Password updated successfully!");
      setNewPassForm({ newPass: "", confirmPass: "" });
    } catch (e) {
      showToast("Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
    onExit();
  };

  const loadData = async () => {
    if (!authed) return;
    setLoading(true);
    try {
      if (tab === "overview") {
        const s = await fetchAdminStats();
        setStats(s);
      } else if (tab === "submissions") {
        const sub = await fetchAdminSubmissions();
        setSubmissions(sub);
      } else if (tab === "comments") {
        const com = await fetchAdminComments();
        setComments(com);
      } else if (tab === "visitors") {
        const vis = await fetchAdminVisitors();
        setVisitors(vis);
      } else if (tab === "question-quality") {
        const qa = await fetchAdminAnalyticsQuestions();
        setQAnalytics(qa);
      } else if (tab === "advanced-analytics") {
        const [ret, fun, pop] = await Promise.all([
          fetchAdminAnalyticsRetention(),
          fetchAdminAnalyticsFunnel(),
          fetchAdminAnalyticsPopular()
        ]);
        setRetention(ret);
        setFunnel(fun);
        setPopularQs(pop);
      }
    } catch (e) {
      console.error("Admin load error", e);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authed, tab]);

  const handleBulkImport = async () => {
    if (!importFile) return;
    setLoading(true);
    try {
      const res = await bulkImportQuestions(importFile);
      showToast(`✅ Imported ${res.imported} questions! (${res.errors} errors)`);
      setImportFile(null);
    } catch (e) {
      showToast("Import failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="admin-overlay">
        <div className="admin-login-card">
          <div className="admin-logo">🛡️</div>
          <h2 className="admin-title">Admin Portal</h2>
          <p className="admin-subtitle">ThinkSwipe Dashboard</p>
          <input
            className="admin-input"
            type="text"
            placeholder="Username"
            value={loginForm.user}
            onChange={e => setLoginForm(p => ({ ...p, user: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={loginForm.pass}
            onChange={e => setLoginForm(p => ({ ...p, pass: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button className="admin-login-btn" onClick={handleLogin}>Login →</button>
          <button className="admin-back-btn" onClick={onExit}>← Back to App</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {toast && (
        <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">🛡️</span>
          <span className="admin-brand-name">THINKSWIPE</span>
        </div>
        <nav className="admin-nav">
          {[
            { key: "overview", icon: "📊", label: "Overview" },
            { key: "question-quality", icon: "⭐", label: "Question Quality" },
            { key: "advanced-analytics", icon: "📈", label: "Growth & Retention" },
            { key: "bulk-import", icon: "📥", label: "Bulk Import" },
            { key: "submissions", icon: "📝", label: `Submissions` },
            { key: "comments", icon: "💬", label: "Comments" },
            { key: "visitors", icon: "👁️", label: "Visitors" },
            { key: "security", icon: "🔐", label: "Security" },
          ].map(item => (
            <button
              key={item.key}
              className={`admin-nav-btn ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {loading && <div className="admin-loading-spinner"><div className="spinner"></div></div>}

        {/* OVERVIEW */}
        {tab === "overview" && stats && (
          <div className="admin-section fade-in">
            <h1 className="admin-section-title">📊 Overall Stats</h1>
            <div className="admin-stats-grid">
              <StatCard icon="👁️" label="Total Visitors" value={stats.totalVisitors} color="#25f4ee" />
              <StatCard icon="🎯" label="Total Attempts" value={stats.totalAttempts} color="#fe2c55" />
              <StatCard icon="❓" label="Total Questions" value={stats.totalQuestions} color="#ffd700" />
              <StatCard icon="⭐" label="Avg Score" value={`${stats.averageScore}/10`} color="#a78bfa" />
            </div>
          </div>
        )}

        {/* QUESTION QUALITY */}
        {tab === "question-quality" && (
          <div className="admin-section fade-in">
            <h1 className="admin-section-title">⭐ Question Performance</h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Avg Score</th>
                    <th>Skip Rate</th>
                    <th>Attempts</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {qAnalytics.map(q => (
                    <tr key={q.id}>
                      <td className="admin-td-title">{q.title}</td>
                      <td><span className="admin-badge">{q.category}</span></td>
                      <td style={{ fontWeight: 800, color: q.avgScore < 5 ? "#fe2c55" : "#34d399" }}>{q.avgScore}</td>
                      <td>{q.skipRate}%</td>
                      <td>{q.attempts}</td>
                      <td>
                        {q.avgScore < 4 && q.attempts > 5 && <span className="status-badge warn">TOO HARD</span>}
                        {q.skipRate > 40 && <span className="status-badge warn">BORING</span>}
                        {q.avgScore >= 4 && q.skipRate <= 40 && <span className="status-badge ok">GOOD</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADVANCED ANALYTICS */}
        {tab === "advanced-analytics" && (
          <div className="admin-section fade-in">
            <div className="analytics-layout">
              <div className="analytics-left">
                <h2 className="sub-title">Retention</h2>
                {retention && (
                  <div className="retention-cards">
                    <StatCard icon="🔥" label="D1 Retention" value={`${retention.d1}%`} color="#fe2c55" />
                    <StatCard icon="📅" label="D7 Retention" value={`${retention.d7}%`} color="#25f4ee" />
                    <StatCard icon="♾️" label="D30 Retention" value={`${retention.d30}%`} color="#ffd700" />
                  </div>
                )}

                <h2 className="sub-title" style={{ marginTop: "30px" }}>Funnel</h2>
                {funnel && (
                  <div className="funnel-viz">
                    <div className="funnel-step">
                      <label>Impressions</label>
                      <div className="bar" style={{ width: "100%" }}>{funnel.views}</div>
                    </div>
                    <div className="funnel-step">
                      <label>Attempts ({funnel.attemptRate}%)</label>
                      <div className="bar" style={{ width: `${funnel.attemptRate}%` }}>{funnel.attempts}</div>
                    </div>
                    <div className="funnel-step">
                      <label>Conversions ({funnel.submitRate}%)</label>
                      <div className="bar" style={{ width: `${funnel.submitRate}%` }}>{funnel.submissions}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="analytics-right">
                <h2 className="sub-title">Popular Questions</h2>
                <div className="popular-list">
                  {popularQs.map((q, i) => (
                    <div key={i} className="pop-item">
                      <span className="pop-rank">#{i+1}</span>
                      <span className="pop-title">{q.title}</span>
                      <span className="pop-count">{q.count} 🎯</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BULK IMPORT */}
        {tab === "bulk-import" && (
          <div className="admin-section fade-in">
            <h1 className="admin-section-title">📥 Bulk Question Import</h1>
            <div className="bulk-import-card glass-card">
              <p>Upload a CSV file with headers: <code>title, category, difficulty, type, options, answer, company</code></p>
              <div className="drop-zone">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={e => setImportFile(e.target.files[0])}
                />
                {importFile && <p className="file-name">Selected: {importFile.name}</p>}
              </div>
              <button 
                className="bulk-submit-btn" 
                disabled={!importFile || loading}
                onClick={handleBulkImport}
              >
                Start Import
              </button>
            </div>
          </div>
        )}

        {/* SUBMISSIONS, COMMENTS, VISITORS (kept from before, just wrapped) */}
        {tab === "submissions" && (
            <div className="admin-section fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="admin-section-title">📝 User Submissions</h1>
                <button onClick={loadData} style={{ background: "#333", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>↻ Refresh Data</button>
              </div>
              {/* Existing submission table logic... */}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Question</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {submissions.map(s => (
                      <tr key={s.id}>
                        <td>{s.questionText}</td>
                        <td><span className={`status-${s.status.toLowerCase()}`}>{s.status}</span></td>
                        <td>
                          {s.status === "PENDING" ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button 
                                style={{ background: "#34d399", color: "#000", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                                onClick={() => approveSubmission(s.id).then(loadData)}>Approve</button>
                              <button 
                                style={{ background: "transparent", color: "#fe2c55", border: "1px solid #fe2c55", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                                onClick={() => deleteSubmission(s.id).then(loadData)}>Reject</button>
                            </div>
                          ) : (
                            <button 
                              style={{ background: "transparent", color: "#fe2c55", border: "1px solid #fe2c55", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                              onClick={() => deleteSubmission(s.id).then(loadData)}>Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {tab === "comments" && (
          <div className="admin-section fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 className="admin-section-title">💬 User Comments</h1>
              <button onClick={loadData} style={{ background: "#333", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>↻ Refresh Data</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Q-ID</th><th>Comment</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {comments.map(c => (
                    <tr key={c.id}>
                      <td>{c.questionId}</td>
                      <td>{c.commentText}</td>
                      <td><span className={`status-${c.status.toLowerCase()}`}>{c.status}</span></td>
                      <td>
                        {c.status === "PENDING" ? (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button 
                              style={{ background: "#34d399", color: "#000", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                              onClick={() => approveComment(c.id).then(loadData)}>Approve</button>
                            <button 
                              style={{ background: "transparent", color: "#fe2c55", border: "1px solid #fe2c55", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                              onClick={() => deleteComment(c.id).then(loadData)}>Reject</button>
                          </div>
                        ) : (
                          <button 
                            style={{ background: "transparent", color: "#fe2c55", border: "1px solid #fe2c55", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                            onClick={() => deleteComment(c.id).then(loadData)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "visitors" && (
          <div className="admin-section fade-in">
            <h1 className="admin-section-title">👁️ Visitors</h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Visitor</th><th>Platform</th><th>Attempts</th><th>Last Seen</th></tr>
                </thead>
                <tbody>
                  {visitors.map(v => (
                    <tr key={v.id}>
                      <td>{v.visitorId.slice(0, 8)}...</td>
                      <td>{v.platform}</td>
                      <td>{v.questionsAttempted}</td>
                      <td>{new Date(v.lastSeen).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {tab === "security" && (
          <div className="admin-section fade-in">
            <h1 className="admin-section-title">🔐 Security Settings</h1>
            <div className="glass-card" style={{ maxWidth: "400px", padding: "30px" }}>
              <h3 style={{ marginBottom: "20px" }}>Change Admin Password</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input 
                  className="admin-input" 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassForm.newPass}
                  onChange={e => setNewPassForm(p => ({ ...p, newPass: e.target.value }))}
                />
                <input 
                  className="admin-input" 
                  type="password" 
                  placeholder="Confirm New Password" 
                  value={newPassForm.confirmPass}
                  onChange={e => setNewPassForm(p => ({ ...p, confirmPass: e.target.value }))}
                />
                <button 
                  className="admin-login-btn" 
                  style={{ marginTop: "10px" }}
                  onClick={handlePasswordChange}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="admin-stat-card" style={{ "--stat-color": color }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
