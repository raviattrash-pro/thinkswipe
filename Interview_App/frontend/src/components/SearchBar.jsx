import React, { useState, useRef, useEffect } from "react";
import { searchQuestions } from "../api";

export default function SearchBar({ onResults, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      onResults(null); // reset to full feed
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchQuestions(val.trim());
        onResults(results);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleClose = () => {
    setQuery("");
    onResults(null);
    onClose();
  };

  return (
    <div className="search-bar-container" role="search">
      <div className="search-inner">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search questions, topics (Java, SQL, Kafka...)"
          value={query}
          onChange={handleChange}
          aria-label="Search questions"
        />
        {loading && <span className="search-spinner"></span>}
        {query && (
          <button className="search-clear-btn" onClick={handleClose} aria-label="Clear search">
            ✕
          </button>
        )}
        {!query && (
          <button className="search-close-btn" onClick={handleClose} aria-label="Close search">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
