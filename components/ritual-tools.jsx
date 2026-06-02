"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

const QUOTES = [
  { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
  { text: "We are not given a short life but we make it short, and we are not ill-supplied but wasteful of it.", author: "Seneca" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
  { text: "Remember that you are dying. Focus on what matters.", author: "Memento Mori" },
];

const STORAGE_KEY = "memento_reflections_v1";

export function RitualTools() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [text, setText] = useState("");
  const [reflections, setReflections] = useState([]);
  const quote = QUOTES[quoteIndex];

  useEffect(() => {
    try {
      setReflections(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (_error) {
      setReflections([]);
    }
  }, []);

  const latestReflections = useMemo(() => reflections.slice(0, 3), [reflections]);

  function commitReflection() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry = {
      date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
      text: trimmed,
      quote: quote.text,
    };
    const next = [entry, ...reflections].slice(0, 12);
    setReflections(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setText("");
  }

  return (
    <div className="ritual-grid">
      <button className="quote-widget" type="button" onClick={() => setQuoteIndex((index) => (index + 1) % QUOTES.length)}>
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">{quote.author}</p>
        <div className="quote-tip">Reflect further</div>
      </button>

      <div className="reflection-widget">
        <h3 className="reflection-title">Daily Reflection Log</h3>
        <p className="reflection-prompt">Reflect on mortality for today. What will you do with your borrowed time?</p>
        <div className="reflection-input-container">
          <textarea
            className="reflection-textarea"
            id="reflectionTextarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write your single-sentence reflection here..."
          />
          <Button className="reflection-submit-btn" variant="miniPrimary" type="button" onClick={commitReflection}>
            Commit to Log
          </Button>
        </div>
        {latestReflections.length ? (
          <div className="reflection-log-list">
            {latestReflections.map((item, index) => (
              <div className="reflection-log-item" key={`${item.date}-${index}`}>
                <div className="reflection-log-meta">{item.date}</div>
                <p className="reflection-log-text">"{item.text}"</p>
                <span className="reflection-log-quote">Reflecting on: {item.quote}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="breathing-widget">
        <h3 className="breathing-widget-header">Mindful Breathing Ritual</h3>
        <p className="breathing-prompt">Take a moment of quiet focus before reading. Breathe in, hold, then release.</p>
        <div className="breathing-circle-container" aria-hidden="true">
          <div className="breathing-circle-bg" />
          <div className="breathing-circle-active inhale" />
        </div>
        <p className="breathing-instruction">Ready</p>
        <p className="breathing-timer">4-7-8 rhythm</p>
      </div>
    </div>
  );
}
