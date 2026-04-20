import React from "react";

export default function ShimmerCard() {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer-card">
        {/* Top nav skeleton */}
        <div className="shimmer-nav">
          <div className="shimmer-circle shimmer-anim"></div>
          <div className="shimmer-bar shimmer-anim" style={{ width: "120px" }}></div>
          <div className="shimmer-bar shimmer-anim" style={{ width: "60px" }}></div>
        </div>

        {/* Content skeleton */}
        <div className="shimmer-content">
          <div className="shimmer-badge shimmer-anim"></div>
          <div className="shimmer-text shimmer-anim" style={{ width: "90%", height: "24px" }}></div>
          <div className="shimmer-text shimmer-anim" style={{ width: "80%", height: "24px" }}></div>
          <div className="shimmer-text shimmer-anim" style={{ width: "70%", height: "24px" }}></div>

          <div className="shimmer-tags">
            <div className="shimmer-tag shimmer-anim"></div>
            <div className="shimmer-tag shimmer-anim"></div>
            <div className="shimmer-tag shimmer-anim"></div>
          </div>

          {/* MCQ options skeletons */}
          <div className="shimmer-options">
            <div className="shimmer-option shimmer-anim"></div>
            <div className="shimmer-option shimmer-anim"></div>
            <div className="shimmer-option shimmer-anim"></div>
            <div className="shimmer-option shimmer-anim"></div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="shimmer-sidebar">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="shimmer-icon shimmer-anim"></div>
          ))}
        </div>
      </div>

      {/* Fun loading tips while waiting */}
      <div className="loading-tip">
        <div className="loading-tip-icon">💡</div>
        <p className="loading-tip-text">
          {TIPS[Math.floor(Date.now() / 10000) % TIPS.length]}
        </p>
      </div>
    </div>
  );
}

const TIPS = [
  "Spring Boot auto-configures beans — know @SpringBootApplication!",
  "Kafka uses partitions for parallel processing. Each consumer = 1 partition.",
  "In Java, HashMap is not thread-safe. Use ConcurrentHashMap instead.",
  "SQL N+1 problem? Use JOIN FETCH in JPQL to avoid lazy loading issues.",
  "LLD tip: Start with use cases → entities → relationships → methods.",
  "Microservices: each service owns its own database. No shared DB!",
  "Java 8 streams are lazy — they only execute when a terminal op is called.",
  "In Kafka, a consumer group allows load balancing across multiple consumers.",
  "Spring @Transactional works only on public methods via proxying.",
  "SQL indexes speed up reads but slow down writes. Use them wisely!",
];
