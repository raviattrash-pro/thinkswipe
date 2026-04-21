import { useEffect, useState, useRef, useCallback } from "react";
import { 
  fetchQuestions, submitAnswer, likeQuestion, fetchPerformanceSummary, 
  pingVisitor, fetchByCompany, skipQuestion, updateLeaderboardProgress,
  getVisitorId
} from "./api";
import ShimmerCard from "./components/ShimmerCard";
import SearchBar from "./components/SearchBar";
import UserSubmit from "./components/UserSubmit";
import AdminPanel from "./components/AdminPanel";
import CompanyFilter from "./components/CompanyFilter";
import Leaderboard from "./components/Leaderboard";
import DailyChallenge from "./components/DailyChallenge";
import CodeSandbox from "./components/CodeSandbox";

// Audio Assets (using placeholders or CDN)
const SOUNDS = {
  ding: new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_77ce981c4b.mp3"),
  whoosh: new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c3507fe083.mp3"),
  error: new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_06d3184f47.mp3")
};

const OFFLINE_QUESTIONS = [
  {
    id: "offline-1", title: "What is the primary difference between @Component, @Service, and @Repository in Spring?",
    category: "Spring Boot", difficulty: "Easy", type: "MCQ",
    options: "They are identical,@Repository adds DB exception translation,@Service adds security,@Component is deprecated",
    referenceAnswer: "@Repository adds DB exception translation",
    explanation: "@Repository adds persistence exception translation on top of the @Component stereotype. @Service currently acts mainly as a marker.",
    likeCount: 0,
  },
  {
    id: "offline-2", title: "Which of the following is true about Java's garbage collection?",
    category: "Java", difficulty: "Medium", type: "MCQ",
    options: "It guarantees no memory leaks,It runs at a fixed interval,It cannot be forced precisely by the programmer,It only collects objects with no references in Eden space",
    referenceAnswer: "It cannot be forced precisely by the programmer",
    explanation: "Garbage collection in Java reclaims memory automatically, but System.gc() is only a hint and execution time cannot be precisely controlled or forced.",
    likeCount: 0,
  },
  {
    id: "offline-3", title: "In SQL, what is the key difference between a LEFT JOIN and an INNER JOIN?",
    category: "SQL", difficulty: "Easy", type: "MCQ",
    options: "LEFT JOIN returns all records from the left table,INNER JOIN only works on primary keys,LEFT JOIN is faster,There is no difference",
    referenceAnswer: "LEFT JOIN returns all records from the left table",
    explanation: "A LEFT JOIN returns all records from the left table and matched records from the right table. INNER JOIN requires matches in both.",
    likeCount: 0,
  },
  {
    id: "offline-4", title: "Which statement best describes a Kafka Topic partition?",
    category: "Kafka", difficulty: "Medium", type: "MCQ",
    options: "A globally ordered queue,An ordered immutable sequence of messages,Can be consumed by multiple consumers in the same group,Partitions cannot be replicated",
    referenceAnswer: "An ordered immutable sequence of messages",
    explanation: "A Kafka partition is an ordered, immutable sequence of records that is continually appended to.",
    likeCount: 0,
  },
  {
    id: "offline-5", title: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    category: "DSA", difficulty: "Easy", type: "MCQ",
    options: "O(1),O(N),O(log N),O(N log N)",
    referenceAnswer: "O(log N)",
    explanation: "In a balanced BST, roughly half the tree is eliminated at each step, resulting in O(log N) time complexity.",
    likeCount: 0,
  },
  {
    id: "offline-6", title: "What does the CAP theorem state regarding distributed systems?",
    category: "System Design", difficulty: "Medium", type: "MCQ",
    options: "You can achieve all three properties simultaneously,You can only achieve two of the three properties simultaneously,Databases must be relational to be consistent,Eventual consistency violates Partition tolerance",
    referenceAnswer: "You can only achieve two of the three properties simultaneously",
    explanation: "The CAP theorem states that a distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition tolerance.",
    likeCount: 0,
  },
  {
    id: "offline-7", title: "Which HTTP method is considered idempotent?",
    category: "API Design", difficulty: "Easy", type: "MCQ",
    options: "POST,PUT,Both POST and PUT,Neither POST nor PUT",
    referenceAnswer: "PUT",
    explanation: "PUT is idempotent, meaning making multiple identical requests has the same effect as making a single request. POST creates new resources each time.",
    likeCount: 0,
  }
];

const initialResult = { score: null, feedback: "", referenceAnswer: "", originalQuestion: "" };

function App() {
  const [showAdmin, setShowAdmin] = useState(() => window.location.hash === "#admin");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(initialResult);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Phase 2 New State
  const [showDaily, setShowDaily] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [activeCompany, setActiveCompany] = useState("All");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitMode, setSubmitMode] = useState("question");
  const [feedMode, setFeedMode] = useState("foryou");
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const [mistakes, setMistakes] = useState(() => JSON.parse(localStorage.getItem("interview_mistakes") || "[]"));
  const [likedIds, setLikedIds] = useState(() => new Set(JSON.parse(localStorage.getItem("interview_liked_ids") || "[]")));
  const [likedQuestions, setLikedQuestions] = useState(() => JSON.parse(localStorage.getItem("interview_liked_questions") || "[]"));
  const [rechallengeQuestion, setRechallengeQuestion] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bonus, setBonus] = useState(null);
  const [isSpeedMode, setIsSpeedMode] = useState(() => localStorage.getItem("interview_speed_mode") === "true");
  const [timerValue, setTimerValue] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [confidence, setConfidence] = useState(null);
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [rankFlash, setRankFlash] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0, total: 0, xp: parseInt(localStorage.getItem("interview_xp") || "0")
  });
  const [isBoss, setIsBoss] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [slideDir, setSlideDir] = useState(null);
  const touchStartY = useRef(null);

  const textareaRef = useRef(null);

  const levelInfo = (xp) => {
    if (xp < 100) return { name: "Beginner", lvl: 1 };
    if (xp < 300) return { name: "Rising Star", lvl: 2 };
    if (xp < 1000) return { name: "Intermediate", lvl: 5 };
    return { name: "Interview Master", lvl: 10 };
  };

  const playSound = (name) => {
    try {
      const audio = SOUNDS[name];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
          // Silent catch for autoplay policies or broken sources
          console.warn(`Audio play failed for ${name}:`, err.message);
        });
      }
    } catch(e) {}
  };

  const triggerHaptic = (pattern = 50) => {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  };

  const loadFeed = async (reset = false) => {
    if (isFetchingMore) return;
    if (reset) { setIsLoading(true); setPage(0); setQuestions([]); }
    else setIsFetchingMore(true);

    try {
      let data;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );

      if (activeCompany !== "All") {
        data = await Promise.race([
          fetchByCompany(activeCompany),
          timeoutPromise
        ]);
        setHasMore(false);
      } else {
        data = await Promise.race([
          fetchQuestions(reset ? 0 : page + 1),
          timeoutPromise
        ]);
        setPage(prev => reset ? 0 : prev + 1);
        setHasMore(data.length === 20);
      }

      setQuestions(prev => reset ? data : [...prev, ...data]);
      setBackendReady(true);
      setOfflineMode(false);
    } catch (e) {
      if (reset) {
        setOfflineMode(true);
        setQuestions(OFFLINE_QUESTIONS);
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => { loadFeed(true); }, [activeCompany]);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // Visitor Tracking Ping
  useEffect(() => {
    const platform = window.innerWidth <= 768 ? "MOBILE" : "DESKTOP";
    pingVisitor(platform, 0);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Infinite Scroll Observer
  useEffect(() => {
    if (currentIndex >= questions.length - 3 && hasMore && !isFetchingMore && activeCompany === "All") {
      loadFeed();
    }
  }, [currentIndex, questions.length]);

  const activeQuestions = searchResults || (feedMode === "following" ? [...mistakes, ...likedQuestions] : questions);
  
  const currentQuestion = rechallengeQuestion || 
    (activeQuestions.length === 0 ? null : activeQuestions[currentIndex % activeQuestions.length]);

  // Visual Timer Logic
  useEffect(() => {
    if (!timerActive || result.score !== null) return;
    const interval = setInterval(() => {
      setTimerValue(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(true); // Auto-reveal on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, result.score, currentQuestion]);
  const handleSubmit = async (forceReveal = false) => {
    if (!currentQuestion || (!answer.trim() && !forceReveal && !showOptions) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      let res;
      
      if (offlineMode || String(currentQuestion.id).startsWith("offline-")) {
        await new Promise(r => setTimeout(r, 400));
        const isCorrect = !forceReveal && answer.toLowerCase().trim() === (currentQuestion.referenceAnswer || "").toLowerCase().trim();
        res = {
          score: isCorrect ? 10 : 1,
          feedback: isCorrect ? "Awesome job!" : "Incorrect. See the reference answer.",
          referenceAnswer: currentQuestion.referenceAnswer || "Offline fallback completed.",
        };
      } else {
        res = await submitAnswer({ questionId: currentQuestion.id, userAnswer: forceReveal ? "Reveal" : answer.trim() });
      }

      setResult({ ...res, originalQuestion: currentQuestion.title });
      
      if (res.score >= 7) {
        playSound("ding");
        triggerHaptic([50, 30, 50]);
        setStreak(s => s + 1);
        updateLeaderboardProgress(res.score);
      } else {
        playSound("error");
        setStreak(0);
        // Add to mistakes if not already there
        if (!mistakes.find(m => m.id === currentQuestion.id)) {
          const newMistakes = [currentQuestion, ...mistakes].slice(0, 50);
          setMistakes(newMistakes);
          localStorage.setItem("interview_mistakes", JSON.stringify(newMistakes));
        }
      }
      
      setSessionStats(prev => ({ ...prev, total: prev.total + 1, xp: prev.xp + res.score }));
      localStorage.setItem("interview_xp", (sessionStats.xp + res.score).toString());
    } catch (e) {
      setError("Connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    playSound("whoosh");
    triggerHaptic(20);
    setSlideDir("up");
    setTimeout(() => {
      setSlideDir(null);
      setCurrentIndex(prev => (prev + 1) % activeQuestions.length);
      setAnswer("");
      setResult(initialResult);
      setConfidence(null);
      setTimerValue(60);
      setTimerActive(true);
    }, 400);
  };

  const handleSkip = () => {
    if (currentQuestion?.id) skipQuestion(currentQuestion.id);
    handleNext();
  };

  const handleLike = async () => {
    if (!currentQuestion) return;
    const qid = currentQuestion.id;
    const isLiked = likedIds.has(qid);
    
    // Toggle locally for instant feedback
    const newLikedIds = new Set(likedIds);
    if (isLiked) {
      newLikedIds.delete(qid);
      setLikedQuestions(prev => prev.filter(q => q.id !== qid));
    } else {
      newLikedIds.add(qid);
      setLikedQuestions(prev => [...prev, currentQuestion]);
      likeQuestion(qid); // Only call API on like, not unlike (simplified)
    }
    setLikedIds(newLikedIds);
    localStorage.setItem("interview_liked_ids", JSON.stringify([...newLikedIds]));
  };

  // TOUCH GESTURE HANDLING
  const handleTouchStart = (e) => {
    // Ignore if swiping inside interactive elements
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.closest('.mcq-container')) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    // threshold of 70px for swipe up
    if (deltaY > 70) {
      handleSkip();
    }
    touchStartY.current = null;
  };

  if (showAdmin) return <AdminPanel onExit={() => setShowAdmin(false)} />;

  return (
    <div 
      className={`tiktok-container ${isBoss ? "boss-mode" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isLoading && <ShimmerCard />}
      
      {!isLoading && (
        <main className={`feed-item ${slideDir ? `slide-${slideDir}` : ""}`}>
          <nav className="top-nav">
            <div className="top-left-profile" onClick={() => setShowLeaderboard(true)}>
              <div className="boss-avatar" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{getVisitorId().substring(0, 4)}</div>
              <div className="level-badge">Lvl {levelInfo(sessionStats.xp).lvl}</div>
            </div>

            <div className="nav-buttons">
              <button className={feedMode === "following" ? "active" : ""} onClick={() => setFeedMode("following")}>
                Mistakes {mistakes.length > 0 && <span className="mistake-count-badge">{mistakes.length}</span>}
              </button>
              <button className={feedMode === "foryou" ? "active" : ""} onClick={() => setFeedMode("foryou")}>For You</button>
            </div>

            <div className="top-right-actions">
              {deferredPrompt && (
                <button className="install-btn" onClick={handleInstallClick}>📲 App</button>
              )}
              <button className="icon-vibe" onClick={() => setShowAdmin(true)}>🛡️</button>
              <button className="icon-vibe" onClick={() => setShowSearch(true)}>🔍</button>
            </div>
          </nav>

          <div className="timer-bar-container">
            <div 
              className="timer-bar-fill" 
              style={{ width: `${(timerValue / 60) * 100}%` }}
            ></div>
          </div>

          <CompanyFilter activeCompany={activeCompany} onSelect={setActiveCompany} />

          <section className="content-area">
            {bonus && <div className="bonus-toast"><h3>🎉 {bonus.message}</h3></div>}

            {result.score === null ? (
              <div className="question-text-wrapper">
                <h1>{currentQuestion?.title}</h1>
                <div className="hashtags">
                  <span>{currentQuestion?.category}</span>
                  <span>{currentQuestion?.difficulty}</span>
                  {currentQuestion?.company && <span className="company-tag">🏢 {currentQuestion.company}</span>}
                  {offlineMode && <span className="offline-tag">OFFLINE</span>}
                </div>

                {currentQuestion?.type === "CODE" && (
                  <CodeSandbox 
                    initialCode={currentQuestion.options} 
                    onAnswerChange={setAnswer} 
                  />
                )}

                {currentQuestion?.type === "MCQ" && currentQuestion?.options && (
                  <div className="mcq-container" style={{ marginTop: '15px' }}>
                    {(typeof currentQuestion.options === "string" 
                      ? currentQuestion.options.split(",") 
                      : currentQuestion.options
                    ).map((opt, i) => (
                      <button 
                        key={i} 
                        className={`choice-chip ${answer === opt ? "active glow-cyan" : ""}`}
                        onClick={() => {
                          setAnswer(opt);
                          triggerHaptic(15);
                          playSound("ding");
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="result-overlay glass-card fade-in">
                <div className="question-recap">
                  <div className="recap-header">
                    <h3>Question Recap</h3>
                  </div>
                  <p>{currentQuestion?.title}</p>
                </div>

                <div className="score-ring">
                  <span className="score-num">{result.score}</span>
                </div>
                <p className="feedback-text">{result.feedback}</p>
                
                <div className="comp-minimal">
                  <div className="comp-row"><b>YOU:</b> <p>{answer || "Revealed"}</p></div>
                  <div className="comp-row"><b>IDEAL:</b> <p>{result.referenceAnswer}</p></div>
                </div>

                {currentQuestion?.explanation && (
                  <div className="explanation-box fade-in">
                    <p className="explanation-tag">💡 WHY THIS IS CORRECT:</p>
                    <p className="explanation-content">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                <div className="result-controls">
                  <button className="retry-btn-inline" onClick={() => { 
                    setResult(initialResult); 
                    setTimerValue(60); 
                    setTimerActive(true); 
                  }}>Retry</button>
                  <button className="pause-btn" onClick={handleNext}>Next Question</button>
                </div>
              </div>
            )}

            <div className="input-section">
              {result.score === null && currentQuestion?.type !== "CODE" && currentQuestion?.type !== "MCQ" && (
                confidence === null ? (
                  <div className="confidence-selector">
                    <p>Ready to swipe? 🤔</p>
                    <div className="icons">
                      <button onClick={() => setConfidence(0)}>😐</button>
                      <button onClick={() => setConfidence(1)}>🙂</button>
                      <button onClick={() => setConfidence(2)}>😎</button>
                    </div>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    className="tiktok-answer-box glass-neo"
                    placeholder="Type your elite answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    autoFocus
                  />
                )
              )}
            </div>
          </section>

          <aside className="side-bar">
            <div className="action-item" onClick={() => setShowLeaderboard(true)}>
              <div className="icon-btn leader">🏆</div>
              <span>Rank</span>
            </div>
            <div className="action-item" onClick={() => setShowDaily(true)}>
              <div className="icon-btn daily">🌟</div>
              <span>Daily</span>
            </div>
            <div className="action-item" onClick={handleLike}>
              <div className={`icon-btn heart ${likedIds.has(currentQuestion?.id) ? "active" : ""}`}>❤️</div>
              <span>{likedIds.has(currentQuestion?.id) ? "Liked" : "Like"}</span>
            </div>
            <div className="action-item" onClick={() => { setSubmitMode("comment"); setShowSubmit(true); }}>
              <div className="icon-btn comment">💬</div>
              <span>Comment</span>
            </div>
            <div className="action-item" onClick={() => handleSubmit(false)}>
              <div className="icon-btn submit">🚀</div>
              <span>{isSubmitting ? "..." : "Send"}</span>
            </div>
            <div className="action-item" onClick={handleSkip}>
              <div className="icon-btn next">⏭️</div>
              <span>Skip</span>
            </div>
            <div className="music-disc-wrapper">
              <div className="music-disc rotating">🔥{streak}</div>
            </div>
          </aside>
        </main>
      )}

      {/* MODALS */}
      {showDaily && <DailyChallenge onClose={() => setShowDaily(false)} />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showSearch && (
        <div className="search-overlay">
          <SearchBar onResults={setSearchResults} onClose={() => { setShowSearch(false); setSearchResults(null); }} />
        </div>
      )}
      {showSubmit && <UserSubmit questionId={currentQuestion?.id} defaultMode={submitMode} onClose={() => setShowSubmit(false)} />}
    </div>
  );
}

export default App;
