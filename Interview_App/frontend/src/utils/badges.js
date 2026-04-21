// ============================================================
//  Badge / Achievement System for ThinkSwipe
//  All logic is localStorage-based — no backend needed.
// ============================================================

export const BADGES = [
  // ── Getting Started ────────────────────────────────────────
  {
    id: "first_blood",
    icon: "🩸",
    name: "First Blood",
    desc: "Answer your very first question",
    rarity: "common",
    check: ({ totalAnswered }) => totalAnswered >= 1,
  },
  {
    id: "ten_down",
    icon: "🔟",
    name: "Ten Down",
    desc: "Answer 10 questions",
    rarity: "common",
    check: ({ totalAnswered }) => totalAnswered >= 10,
  },
  {
    id: "half_century",
    icon: "🏏",
    name: "Half Century",
    desc: "Answer 50 questions",
    rarity: "rare",
    check: ({ totalAnswered }) => totalAnswered >= 50,
  },
  {
    id: "century",
    icon: "💯",
    name: "Century Club",
    desc: "Answer 100 questions",
    rarity: "epic",
    check: ({ totalAnswered }) => totalAnswered >= 100,
  },

  // ── Accuracy ───────────────────────────────────────────────
  {
    id: "sharp_shooter",
    icon: "🎯",
    name: "Sharp Shooter",
    desc: "Score 10/10 on any question",
    rarity: "common",
    check: ({ lastScore }) => lastScore === 10,
  },
  {
    id: "hot_streak",
    icon: "🔥",
    name: "On Fire",
    desc: "Get 5 correct answers in a row",
    rarity: "rare",
    check: ({ streak }) => streak >= 5,
  },
  {
    id: "unstoppable",
    icon: "⚡",
    name: "Unstoppable",
    desc: "Get 10 correct answers in a row",
    rarity: "epic",
    check: ({ streak }) => streak >= 10,
  },
  {
    id: "perfectionist",
    icon: "💎",
    name: "Perfectionist",
    desc: "Score above 80% across 20 answers",
    rarity: "epic",
    check: ({ totalAnswered, highScoreCount }) =>
      totalAnswered >= 20 && highScoreCount / totalAnswered >= 0.8,
  },

  // ── Category Mastery ───────────────────────────────────────
  {
    id: "java_ninja",
    icon: "☕",
    name: "Java Ninja",
    desc: "Answer 10 Java questions correctly",
    rarity: "rare",
    check: ({ categoryCorrect }) => (categoryCorrect["Java Code"] || 0) + (categoryCorrect["Core Java"] || 0) >= 10,
  },
  {
    id: "sql_wizard",
    icon: "🗄️",
    name: "SQL Wizard",
    desc: "Answer 10 SQL questions correctly",
    rarity: "rare",
    check: ({ categoryCorrect }) => (categoryCorrect["SQL"] || 0) >= 10,
  },
  {
    id: "spring_master",
    icon: "🌱",
    name: "Spring Master",
    desc: "Answer 10 Spring Boot questions correctly",
    rarity: "rare",
    check: ({ categoryCorrect }) => (categoryCorrect["Spring Boot"] || 0) >= 10,
  },
  {
    id: "cloud_architect",
    icon: "☁️",
    name: "Cloud Architect",
    desc: "Answer 10 AWS questions correctly",
    rarity: "rare",
    check: ({ categoryCorrect }) => (categoryCorrect["AWS"] || 0) >= 10,
  },
  {
    id: "system_thinker",
    icon: "🧩",
    name: "System Thinker",
    desc: "Answer 5 Microservices questions correctly",
    rarity: "common",
    check: ({ categoryCorrect }) => (categoryCorrect["Microservices"] || 0) >= 5,
  },
  {
    id: "pattern_guru",
    icon: "🏗️",
    name: "Pattern Guru",
    desc: "Answer 10 LLD questions correctly",
    rarity: "rare",
    check: ({ categoryCorrect }) => (categoryCorrect["LLD"] || 0) >= 10,
  },

  // ── Speed ──────────────────────────────────────────────────
  {
    id: "speed_demon",
    icon: "🏎️",
    name: "Speed Demon",
    desc: "Answer a question correctly in under 10 seconds",
    rarity: "rare",
    check: ({ lastAnswerMs }) => lastAnswerMs > 0 && lastAnswerMs <= 10000,
  },
  {
    id: "lightning",
    icon: "⚡",
    name: "Lightning Fingers",
    desc: "Answer correctly in under 5 seconds",
    rarity: "epic",
    check: ({ lastAnswerMs }) => lastAnswerMs > 0 && lastAnswerMs <= 5000,
  },

  // ── XP & Level ─────────────────────────────────────────────
  {
    id: "rising_star",
    icon: "⭐",
    name: "Rising Star",
    desc: "Earn 100 XP",
    rarity: "common",
    check: ({ xp }) => xp >= 100,
  },
  {
    id: "intermediate",
    icon: "🥈",
    name: "Intermediate",
    desc: "Earn 500 XP",
    rarity: "rare",
    check: ({ xp }) => xp >= 500,
  },
  {
    id: "interview_master",
    icon: "🏆",
    name: "Interview Master",
    desc: "Earn 1000 XP — you're ready!",
    rarity: "legendary",
    check: ({ xp }) => xp >= 1000,
  },

  // ── Streak / Consistency ───────────────────────────────────
  {
    id: "day_one",
    icon: "📅",
    name: "Day One",
    desc: "Practice on 2 different days",
    rarity: "common",
    check: ({ activeDays }) => activeDays >= 2,
  },
  {
    id: "weekly_warrior",
    icon: "🗓️",
    name: "Weekly Warrior",
    desc: "Practice 7 days in a row",
    rarity: "legendary",
    check: ({ dailyStreakDays }) => dailyStreakDays >= 7,
  },
];

// ── Rarity colors ──────────────────────────────────────────────
export const RARITY_COLOR = {
  common:    { bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.3)",  label: "#ccc",    glow: "rgba(255,255,255,0.15)" },
  rare:      { bg: "rgba(37,244,238,0.1)",  border: "rgba(37,244,238,0.4)",   label: "#25f4ee", glow: "rgba(37,244,238,0.2)"  },
  epic:      { bg: "rgba(160,32,240,0.12)", border: "rgba(160,32,240,0.5)",   label: "#b06ef3", glow: "rgba(160,32,240,0.25)" },
  legendary: { bg: "rgba(255,193,7,0.12)",  border: "rgba(255,193,7,0.55)",   label: "#ffc107", glow: "rgba(255,193,7,0.3)"   },
};

// ── localStorage helpers ───────────────────────────────────────
const STORAGE_KEY = "ts_earned_badges";
const ANALYTICS_KEY = "ts_badge_analytics";

export function getEarnedBadges() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

export function saveEarnedBadge(id) {
  const current = getEarnedBadges();
  if (!current.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  }
}

export function getBadgeAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveBadgeAnalytics(updates) {
  const current = getBadgeAnalytics();
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify({ ...current, ...updates }));
}

// ── Streak day helpers ─────────────────────────────────────────
export function recordActivityToday() {
  const key = "ts_activity_log";
  let log;
  try { log = JSON.parse(localStorage.getItem(key) || "{}"); } catch { log = {}; }
  const today = new Date().toISOString().slice(0, 10);
  log[today] = (log[today] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(log));
  return log;
}

export function getActivityLog() {
  try { return JSON.parse(localStorage.getItem("ts_activity_log") || "{}"); } catch { return {}; }
}

export function computeDailyStreakDays() {
  const log = getActivityLog();
  const dates = Object.keys(log).sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 0;
  let current = new Date();
  for (const d of dates) {
    const diff = Math.round((current - new Date(d)) / 86400000);
    if (diff > 1) break;
    streak++;
    current = new Date(d);
  }
  return streak;
}

// ── Main evaluator — call after every answer submission ────────
export function evaluateBadges({ score, category, streak, xp, startTime }) {
  const analytics = getBadgeAnalytics();
  const earned = getEarnedBadges();
  const newlyUnlocked = [];

  // Update analytics
  const totalAnswered = (analytics.totalAnswered || 0) + 1;
  const highScoreCount = (analytics.highScoreCount || 0) + (score >= 7 ? 1 : 0);
  const categoryCorrect = analytics.categoryCorrect || {};
  if (score >= 7 && category) {
    categoryCorrect[category] = (categoryCorrect[category] || 0) + 1;
  }
  const lastAnswerMs = score >= 7 ? Date.now() - startTime : 0;

  const activeDays = Object.keys(recordActivityToday()).length;
  const dailyStreakDays = computeDailyStreakDays();

  saveBadgeAnalytics({
    totalAnswered,
    highScoreCount,
    categoryCorrect,
    xp,
    activeDays,
    dailyStreakDays,
  });

  const ctx = {
    totalAnswered,
    highScoreCount,
    categoryCorrect,
    xp,
    streak,
    lastScore: score,
    lastAnswerMs,
    activeDays,
    dailyStreakDays,
  };

  for (const badge of BADGES) {
    if (!earned.includes(badge.id) && badge.check(ctx)) {
      saveEarnedBadge(badge.id);
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked; // Array of newly unlocked badge objects
}
