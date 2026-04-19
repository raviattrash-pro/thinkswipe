import { useEffect, useState, useRef } from "react";
import { fetchQuestions, submitAnswer, likeQuestion, fetchPerformanceSummary } from "./api";

const initialResult = {
  score: null,
  feedback: "",
  referenceAnswer: "",
  originalQuestion: ""
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(initialResult);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // New States for Retention Features
  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem("interview_mistakes");
    return saved ? JSON.parse(saved) : [];
  });
  const [likedIds, setLikedIds] = useState(() => {
    const saved = localStorage.getItem("interview_liked_ids");
    return new Set(saved ? JSON.parse(saved) : []);
  });
  const [rechallengeQuestion, setRechallengeQuestion] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bonus, setBonus] = useState(null); // { message: string, xp: number }
  const [idleTime, setIdleTime] = useState(0);
  const [speedPrompt, setSpeedPrompt] = useState(true);
  const [isSpeedMode, setIsSpeedMode] = useState(() => {
    return localStorage.getItem("interview_speed_mode") === "true";
  });
  const [timerValue, setTimerValue] = useState(60);
  const [showOptions, setShowOptions] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [confidence, setConfidence] = useState(null); // 0=low, 1=med, 2=high
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [rankFlash, setRankFlash] = useState(null); // { percentile: number }
  const [sessionStats, setSessionStats] = useState({ 
    correct: 0, 
    total: 0, 
    xp: parseInt(localStorage.getItem("interview_xp") || "0")
  });
  const [isBoss, setIsBoss] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const levelInfo = (xp) => {
    if (xp < 100) return { name: "Beginner", title: "Rising Talent", lvl: 1 };
    if (xp < 300) return { name: "Rising Star", title: "Java Enthusiast", lvl: 2 };
    if (xp < 700) return { name: "Intermediate", title: "DSA Explorer", lvl: 3 };
    if (xp < 1500) return { name: "Advanced", title: "System Design Thinker", lvl: 5 };
    if (xp < 3000) return { name: "Professional", title: "DSA Pro", lvl: 8 };
    return { name: "Interview Master", title: "Code Architect", lvl: 10 };
  };

  const getCuriosityMiles = () => {
    const nextBoss = 10 - (sessionCount % 10);
    return nextBoss;
  };

  const getEmotionalPrefix = (score) => {
    if (score >= 9) return ["🔥 Brilliant!", "🏆 Elite Performance!", "🚀 You're Unstoppable!"][Math.floor(Math.random()*3)];
    if (score >= 7) return ["✅ Solid!", "🧠 Great Thinking!", "👊 Nailed it!"][Math.floor(Math.random()*3)];
    if (score >= 4) return ["💡 You were close!", "🧱 Building momentum...", "🔨 Not quite right, keep going!"][Math.floor(Math.random()*3)];
    return ["😅 Tricky one!", "💀 Most failed this!", "🧘 Deep breath, try again!"][Math.floor(Math.random()*3)];
  };

  useEffect(() => {
    if (showCheckpoint) {
      setBreakCountdown(5);
      const timer = setInterval(() => {
        setBreakCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            fetchPerformanceSummary().then(setPerformance).catch(console.error);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showCheckpoint]);

  useEffect(() => {
    localStorage.setItem("interview_mistakes", JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem("interview_liked_ids", JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    localStorage.setItem("interview_speed_mode", isSpeedMode);
    if (isSpeedMode && timerValue > 10 && result.score === null) {
      setTimerValue(10);
    }
  }, [isSpeedMode]);

  useEffect(() => {
    if (textareaRef.current && result.score === null && confidence !== null) {
      textareaRef.current.focus();
    }
  }, [currentIndex, result.score, rechallengeQuestion, confidence]);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await fetchQuestions();
        
        // Daily Comeback Trigger: Prioritize mistakes if we have any
        const savedMistakes = JSON.parse(localStorage.getItem("interview_mistakes") || "[]");
        if (savedMistakes.length > 0) {
           setBonus({ message: "🔥 Welcome back! Trying 3 past mistakes...", xp: 0 });
           setTimeout(() => setBonus(null), 4000);
           setRechallengeQuestion(savedMistakes[Math.floor(Math.random() * savedMistakes.length)]);
        }
        
        setQuestions(data);
      } catch (loadError) {
        setError("Unable to load the question feed. Start the backend and try again.");
      }
    };

    loadFeed();
  }, []);

  const currentQuestion =
    rechallengeQuestion || (isReviewMode && mistakes.length > 0 ? mistakes[currentIndex % mistakes.length] : (questions.length === 0 ? null : questions[currentIndex % questions.length]));

  // Set Boss state when question changes
  useEffect(() => {
    if (currentQuestion) {
      setIsBoss(currentQuestion.difficulty === 'Hard' || Math.random() < 0.1);
    }
  }, [currentQuestion]);

  const handleSubmit = async (forceReveal = false) => {
    // allow empty submission if showOptions is true (Time's up)
    if (!currentQuestion || (!answer.trim() && !forceReveal && !showOptions) || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setShowOptions(false);
      
      const payload = {
        questionId: currentQuestion.id,
        userAnswer: forceReveal ? "I want to see the answer" : answer.trim()
      };

      const data = await submitAnswer(payload);
      setResult({
        ...data,
        originalQuestion: currentQuestion.text || currentQuestion.title
      });
      
      if (forceReveal) {
        setIsPaused(true);
        setCountdown(10);
      }

      const duration = (Date.now() - startTime) / 1000;

      // System silently saves mistakes (score < 5)
      if (data.score < 5) {
        setMistakes((prev) => {
          if (prev.find(m => m.id === currentQuestion.id)) return prev;
          return [...prev, currentQuestion];
        });
        
        // Persistent Retry on Fail
        setRetryAvailable(true);
        
        // Streak Freeze (Random) - 20% chance to save streak even on fail
        if (streak >= 3 && Math.random() < 0.2) {
            setBonus({ message: "🧊 Streak Frozen! Saved by luck.", xp: 0 });
            setTimeout(() => setBonus(null), 3000);
        } else {
            setStreak(0);
        }
      } else {
        setMistakes((prev) => prev.filter(m => m.id !== currentQuestion.id));
        setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));

        // Update Streak & Surprise Reward
        if (data.score >= 7) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          
          let bonusMsg = "🔥 You're in top 15%";
          let bonusXp = 30;

          // Difficulty Spike Bonus
          if (currentQuestion.difficulty === 'Hard') {
            bonusMsg = "🏆 Elite Bonus Unlocked!";
            bonusXp = 50;
          }

          // Fast Answer Bonus
          if (duration < 10) {
            bonusMsg = "⚡ Fast Answer Bonus!";
            bonusXp = 50;
          }

          // Surprise Reward Logic
          if ((newStreak >= 3 || duration < 10 || isBoss) && Math.random() < 0.3) {
            setBonus({ message: bonusMsg, xp: bonusXp });
            setTimeout(() => setBonus(null), 4000);
          }
        } else if (data.score >= 5) {
          // Almost Correct Boost
          setBonus({ message: "🟡 Almost correct! So close 🔥", xp: 5 });
          setTimeout(() => setBonus(null), 3000);
          setStreak(0);
        } else {
          setStreak(0);
        }

      }

      // 10. XP persistence and session update
      const totalEarned = (bonus?.xp || 0) + (data.score >= 7 ? 20 : (data.score >= 5 ? 10 : 0));
      const newTotalXp = sessionStats.xp + totalEarned;
      localStorage.setItem("interview_xp", newTotalXp.toString());

      setSessionStats(prev => ({ 
        ...prev, 
        correct: prev.correct + (data.score >= 7 ? 1 : 0), 
        total: prev.total + 1,
        xp: newTotalXp
      }));

      const prefix = getEmotionalPrefix(data.score);
      setResult({
        ...data,
        feedback: `${prefix}\n${data.feedback}`,
        originalQuestion: currentQuestion.text || currentQuestion.title
      });
      setSessionCount(prev => prev + 1);
    } catch (submitError) {
      setError("Submission failed. Please check the API connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const alreadyLiked = likedIds.has(qId);

    if (!alreadyLiked) {
      try {
        setLikedIds(prev => new Set(prev).add(qId));
        await likeQuestion(qId);
      } catch (err) {
        console.error("Failed to save like", err);
      }
    } else {
      setLikedIds(prev => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
    }
  };

  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Smart Timer Logic
  useEffect(() => {
    let timer;
    if (result.score === null && questions.length > 0 && !showOptions && !answer.trim()) {
      timer = setInterval(() => {
        setTimerValue(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowOptions(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [result.score, questions.length, currentIndex, showOptions, answer]);

  // Handle auto-advance timer after answer
  useEffect(() => {
    let timer;
    if (result.score !== null && !isPaused && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && result.score !== null) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [result.score, isPaused, countdown]);

  // Handle auto-skip for the Time's Up modal
  useEffect(() => {
    let modalTimer;
    if (showOptions && !isSubmitting) {
      modalTimer = setTimeout(() => {
        handleNext();
      }, 20000); // 20s timeout for the modal itself
    }
    return () => clearTimeout(modalTimer);
  }, [showOptions, isSubmitting]);


  // Smart Skip Detection (60s inactivity)
  useEffect(() => {
    let idleTimer;
    if (result.score === null && questions.length > 0) {
      idleTimer = setInterval(() => {
        const timeSinceActivity = (Date.now() - lastActivity) / 1000;
        if (timeSinceActivity >= 60 && !answer.trim()) {
          setBonus({ message: "Skipped due to inactivity", xp: 0 });
          setTimeout(() => {
             setBonus(null);
             handleNext();
          }, 2000);
        }
      }, 5000); // Check every 5s
    }
    return () => clearInterval(idleTimer);
  }, [result.score, questions.length, currentIndex, lastActivity, answer]);

  const handleNext = () => {
    if (questions.length === 0) return;

    if (sessionCount > 0 && sessionCount % 10 === 0 && !showCheckpoint) {
      setShowCheckpoint(true);
      return;
    }

    const nextCount = answeredCount + 1;
    setAnsweredCount(nextCount);

    // Rank Flash every 5 questions
    if (nextCount > 0 && nextCount % 5 === 0) {
      const percentile = Math.min(99, Math.floor((sessionStats.correct / sessionStats.total) * 100) || 50);
      setRankFlash(percentile);
      setTimeout(() => setRankFlash(null), 3000);
    }

    if (nextCount % 5 === 0 && mistakes.length > 0) {
      const randomMistake = mistakes[Math.floor(Math.random() * mistakes.length)];
      setRechallengeQuestion(randomMistake);
    } else {
      setRechallengeQuestion(null);
      
      // Auto Topic Switching: If next 3 questions are same category, find a different one
      const currentCat = currentQuestion?.category;
      let nextIdx = (currentIndex + 1) % questions.length;
      if (questions[nextIdx]?.category === currentCat && questions[(nextIdx+1)%questions.length]?.category === currentCat) {
         // Jump ahead to first different category
         for (let i = 0; i < questions.length; i++) {
           const checkIdx = (nextIdx + i) % questions.length;
           if (questions[checkIdx].category !== currentCat) {
             nextIdx = checkIdx;
             break;
           }
         }
      }
      setCurrentIndex(nextIdx);
    }

    setAnswer("");
    setResult(initialResult);
    setError("");
    setIsPaused(false);
    setCountdown(10);
    setTimerValue(isSpeedMode ? 10 : 60);
    setShowOptions(false);
    setStartTime(Date.now());
    setLastActivity(Date.now());
    setBonus(null);
    setConfidence(null);
    setRetryAvailable(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (result.score === null) {
        handleSubmit();
      } else if (currentQuestion) {
        handleNext();
      }
    }
  };

  if (!currentQuestion && !error) {
    return (
      <div className="tiktok-container loading">
        <div className="boss-avatar pulsing">🤖</div>
        <p>Loading Feed...</p>
      </div>
    );
  }

  return (
    <div className={`tiktok-container ${isBoss ? 'boss-mode' : ''}`}>
      {/* --- TOP NAVIGATION --- */}
      <main className="feed-item">
        {/* --- TOP NAVIGATION (Moved Inside) --- */}
        <nav className="top-nav">
          <div className="avatar-space top-left-profile">
            <div className={`icon-btn boss-avatar ${isBoss ? 'pulsing glow-red' : ''}`}>
               🤖
            </div>
            <div className="level-badge">Lvl {levelInfo(sessionStats.xp).lvl}</div>
          </div>
          
          <div className="nav-buttons">
            <button 
              className={rechallengeQuestion ? 'active' : ''} 
              onClick={() => {
                if (mistakes.length > 0) {
                  setRechallengeQuestion(mistakes[Math.floor(Math.random() * mistakes.length)]);
                }
              }}
            >
              Following
            </button>
            <span className="divider">|</span>
            <button 
              className={!rechallengeQuestion ? 'active' : ''} 
              onClick={() => setRechallengeQuestion(null)}
            >
              For You
            </button>
          </div>

          <div className="top-right-actions">
            {deferredPrompt && (
              <button className="install-btn" onClick={installApp}>
                 📥 <span>App</span>
              </button>
            )}
          </div>
        </nav>

        {/* --- MAIN QUESTION CONTENT --- */}
        <section className="content-area">
          
          {rankFlash !== null && (
            <div className="rank-flash-overlay">
              <div className="rank-content">
                📊 Ahead of {rankFlash}% users
              </div>
            </div>
          )}
          
          {bonus && (
            <div className="bonus-toast">
              <h3>🎉 {bonus.message}</h3>
              <p>+{bonus.xp} XP</p>
            </div>
          )}

          {result.score === null && (
            <div className="question-text-wrapper">
              {isBoss && <span className="boss-badge-inline">👑 BOSS STAGE</span>}
              
              {currentQuestion?.type === 'CODE' || currentQuestion?.type === 'BUG' ? (
                <div className={`code-snippet-container ${currentQuestion.type?.toLowerCase()}-style`}>
                  <div className="code-header">
                    <span>{currentQuestion.type === 'BUG' ? '🐞 Bug Detection' : '💻 Code Output'}</span>
                    <span className="lang-tag">Java</span>
                  </div>
                  <pre className="code-block">
                    <code>{currentQuestion?.text || currentQuestion?.title}</code>
                  </pre>
                </div>
              ) : (
                <h1>{currentQuestion?.text || currentQuestion?.title || "Question unavailable"}</h1>
              )}

              <div className="hashtags">
                <span>{currentQuestion?.category}</span>
                <span>{currentQuestion?.difficulty}</span>
                {currentQuestion?.type && currentQuestion.type !== 'TEXT' && (
                  <span className="type-tag">{currentQuestion.type}</span>
                )}
                <span>#Interview</span>
              </div>
            </div>
          )}

          <div className="input-section">
            {result.score === null && confidence === null && (
              currentQuestion?.type === 'MCQ' ? (
                <div className="mcq-container">
                  {(currentQuestion.options || "").split(",").map((option, idx) => (
                    <button 
                      key={idx} 
                      className="choice-chip glass-neo"
                        onClick={() => {
                          const trimmedOption = option.trim();
                          setAnswer(trimmedOption);
                          setConfidence(2); 
                          // Trigger submission after state update
                          setTimeout(() => {
                            handleSubmit(false);
                          }, 100);
                        }}
                    >
                      {option.trim()}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="confidence-selector">
                  <p>Confidence Level? 🤔</p>
                  <div className="icons">
                    <button onClick={() => setConfidence(0)}>😐</button>
                    <button onClick={() => setConfidence(1)}>🙂</button>
                    <button onClick={() => setConfidence(2)}>😎</button>
                  </div>
                </div>
              )
            )}

            {confidence !== null && result.score === null && (
              <textarea
                ref={textareaRef}
                className="tiktok-answer-box"
                placeholder="Type your answer... (Enter to submit)"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setLastActivity(Date.now());
                }}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting || showOptions}
              />
            )}

            {result.score !== null && (
              <div className="result-overlay">
                <div className="question-recap">
                  <div className="recap-header">
                    <h3>❓ Question</h3>
                    {currentQuestion?.type && (
                      <span className={`type-badge-mini ${currentQuestion.type.toLowerCase()}`}>
                        {currentQuestion.type}
                      </span>
                    )}
                  </div>
                  <p>{result.originalQuestion}</p>
                </div>
                <div className="score-ring">
                  <span className="score-num">{result.score}</span>
                  <span className="score-label">/10</span>
                </div>
                <div className="result-controls">
                   <button 
                     className="pause-btn" 
                     onClick={() => setIsPaused(!isPaused)}
                   >
                     {isPaused ? '▶️ Resume' : `⏸️ Pause (${countdown}s)`}
                   </button>
                   {retryAvailable && (
                     <button className="retry-btn-inline" onClick={() => {
                        setResult(initialResult);
                        setAnswer("");
                        setRetryAvailable(false);
                        setTimerValue(isSpeedMode ? 10 : 60);
                        setStartTime(Date.now());
                        setBonus({ message: "Second Chance! 🔥", xp: 0 });
                        setTimeout(() => setBonus(null), 2000);
                     }}>
                        🔄 Retry
                     </button>
                   )}
                </div>
                <div className="comparison-minimal">
                  <div className="comp-row">
                    <span className="label">YOU:</span>
                    <p>{answer || "(No answer)"}</p>
                  </div>
                  <div className="comp-row">
                    <span className="label">IDEAL:</span>
                    <p>{result.referenceAnswer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- RIGHT SIDEBAR ACTIONS --- */}
        <aside className="side-bar">
          
          <div className="action-item curiosity-box">
             <div className={`icon-btn curiosity glow-red pulsing ${timerValue !== null ? 'timer-mode' : ''}`}>
                {timerValue !== null ? '⏰' : '⚡'}
             </div>
             <span>{timerValue !== null ? `${timerValue}s` : `Boss in ${getCuriosityMiles()}`}</span>
          </div>

          <div className={`action-item ${isReviewMode ? 'active' : ''}`} onClick={() => {
            setIsReviewMode(!isReviewMode);
            setBonus({ message: !isReviewMode ? "Entering Review Mode 🎯" : "Exited Review Mode", xp: 0 });
            setTimeout(() => setBonus(null), 2000);
          }}>
            <div className={`icon-btn review glow-cyan ${isReviewMode ? 'pulsing' : ''}`}>
               📂
            </div>
            <span>Review</span>
          </div>

          <div className="action-item" onClick={handleLike}>
            <div className={`icon-btn heart ${likedIds.has(currentQuestion?.id) ? 'active' : ''}`}>
               ❤️
            </div>
            <span>{(currentQuestion?.likeCount ?? 0) + (likedIds.has(currentQuestion?.id) ? 1 : 0)}</span>
          </div>

          <div className="action-item" onClick={handleSubmit}>
            <div className={`icon-btn submit glow-cyan ${isSubmitting ? 'pulsing' : ''}`}>
               🚀
            </div>
            <span>Submit</span>
          </div>

          <div className="action-item" onClick={handleNext}>
            <div className="icon-btn next">
               ⏭️
            </div>
            <span>Next feed</span>
          </div>

          <div className="action-item" onClick={() => setIsSpeedMode(!isSpeedMode)}>
             <div className={`icon-btn speed ${isSpeedMode ? 'active glow-cyan' : ''}`}>
               ⚡
             </div>
             <span>Speed {isSpeedMode ? 'ON' : 'OFF'}</span>
          </div>


          <div className="music-disc-wrapper">
            <div className="music-disc rotating glow-cyan">
               <span className="xp-text">{streak > 0 ? `🔥${streak}` : 'XP'}</span>
            </div>
          </div>
        </aside>

        {/* --- BOTTOM INFORMATION OVERLAY --- */}
        <footer className="bottom-info">
          
          
        </footer>

        {showOptions && (
          <div className="time-up-overlay">
            <div className="options-modal">
              <h2>⏰ Time's Up!</h2>
              <div className="option-buttons">
                <button onClick={() => handleSubmit()}>🚀 Submit anyway</button>
                <button onClick={() => handleSubmit(true)}>👀 See answer</button>
                <button className="skip" onClick={handleNext}>⏭️ Skip</button>
              </div>
            </div>
          </div>
        )}
        {showCheckpoint && (
          <div className="checkpoint-overlay">
            {breakCountdown > 0 ? (
              <div className="break-modal pulsing">
                 <div className="break-icon">🧘</div>
                 <h2>Session Breather...</h2>
                 <p>Take a deep breath. Analytics in {breakCountdown}s</p>
                 <button className="skip-btn" onClick={() => setBreakCountdown(0)}>Skip Break</button>
              </div>
            ) : (
              <div className="checkpoint-modal glass-neo">
                <h2>🎯 Session Checkpoint</h2>
                <div className="checkpoint-grid">
                  <div className="stat-card">
                    <p>Accuracy</p>
                    <h3>{Math.floor((sessionStats.correct / sessionStats.total) * 100) || 0}%</h3>
                  </div>
                  <div className="stat-card">
                    <p>Ranking</p>
                    <h3>{levelInfo(sessionStats.xp).name}</h3>
                  </div>
                </div>
                
                <div className="analytics-box">
                   <p className="strength">✅ Strong in: <span>{performance?.strongestCategory || 'Analyzing...'}</span></p>
                   <p className="weakness">❌ Practice: <span>{performance?.weakestCategory || 'Analyzing...'}</span></p>
                </div>

                <div className="checkpoint-actions">
                   <button className="continue-btn" onClick={() => {
                     setShowCheckpoint(false);
                     setSessionCount(prev => prev + 1); // Increment past the checkpoint
                     handleNext();
                   }}>🚀 Continue Feed</button>
                   
                   <button className="review-btn" onClick={() => {
                     setShowCheckpoint(false);
                     const savedMistakes = JSON.parse(localStorage.getItem("interview_mistakes") || "[]");
                     if (savedMistakes.length > 0) {
                       setRechallengeQuestion(savedMistakes[0]);
                     } else {
                       handleNext();
                     }
                   }}>🔁 Practice Mistakes</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- FLOATING STATUS --- */}
      {error && <div className="floating-error">⚠️ {error}</div>}
    </div>
  );
}

export default App;
